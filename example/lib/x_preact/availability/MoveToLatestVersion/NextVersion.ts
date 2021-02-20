import { h, VNode } from "preact"
import { useLayoutEffect } from "preact/hooks"
import { html } from "htm/preact"

import { loginBox } from "../../../z_vendor/getto-css/preact/layout/login"

import { useApplicationAction } from "../../common/hooks"
import { siteInfo } from "../../common/site"
import { spinner } from "../../common/icon"

import { ApplicationError } from "../../common/System/ApplicationError"

import { NextVersionResource } from "../../../availability/z_EntryPoint/MoveToNextVersion/entryPoint"
import { initialNextVersionComponentState } from "../../../availability/x_Resource/MoveToNextVersion/nextVersion/component"

import { appTargetToPath, FindError } from "../../../availability/nextVersion/data"

export function NextVersion(resource: NextVersionResource): VNode {
    const state = useApplicationAction(resource.nextVersion, initialNextVersionComponentState)

    useLayoutEffect(() => {
        switch (state.type) {
            case "succeed-to-find":
                // /index.html から呼び出されるはずなので、最新かによらず
                // /${version}/index.html に遷移する
                location.href = appTargetToPath(state.target)
                break
        }
    }, [state])

    switch (state.type) {
        case "initial-next-version":
            return EMPTY_CONTENT

        case "delayed-to-find":
            return delayedMessage()

        case "succeed-to-find":
            // location の変更は useLayoutEffect で行うので中身は空
            return EMPTY_CONTENT

        case "failed-to-find":
            return failedMessage(state.err)
    }

    function delayedMessage() {
        return loginBox(siteInfo(), {
            title: "アプリケーション読み込み中",
            body: [
                html`<p>${spinner} アプリケーションの読み込みに時間がかかっています</p>`,
                html`<p>
                    30秒以上かかるようであれば何かがおかしいので、<br />
                    お手数ですが、管理者にお伝えください
                </p>`,
            ],
            footer: "",
        })
    }

    function failedMessage(err: FindError) {
        return h(ApplicationError, { err: errorMessage() })

        function errorMessage() {
            switch (err.err.type) {
                case "server-error":
                    return "コンテンツを取得できませんでした"

                case "infra-error":
                    return `ネットワークエラーが発生しました: ${err.err.err}`
            }
        }
    }
}

const EMPTY_CONTENT = html``
