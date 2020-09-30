import { h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { loginError } from "../layout"

import { ApplicationError } from "../application_error"

import { unpackScriptPath } from "../../application/adapter"

import {
    ApplicationComponent,
    ApplicationParam,
    initialApplicationState,
    initialApplicationRequest,
    LoadError,
} from "../../auth/component/application/component"

type Props = Readonly<{
    component: ApplicationComponent
    param: ApplicationParam
}>

export function Application(props: Props): VNode {
    const [state, setState] = useState(initialApplicationState)
    const [request, setRequest] = useState(() => initialApplicationRequest)
    useEffect(() => {
        props.component.onStateChange(setState)

        const resource = props.component.init()
        setRequest(() => resource.request)
        resource.request({ type: "set-param", param: props.param })
        resource.request({ type: "load" })

        return resource.terminate
    }, [])

    useEffect(() => {
        // script タグは body.appendChild しないとスクリプトがロードされないので useEffect で追加する
        if (state.type === "try-to-load") {
            const script = document.createElement("script")
            script.src = unpackScriptPath(state.scriptPath)
            script.onerror = (err) => {
                request({ type: "failed-to-load", err: { type: "infra-error", err: `${err}` } })
            }
            document.body.appendChild(script)
        }
    }, [state])

    switch (state.type) {
        case "initial-load":
            return EMPTY_CONTENT

        case "try-to-load":
            // script の追加は appendScript でするので、本体は空で返す
            return EMPTY_CONTENT

        case "failed-to-load":
            return failedContent(state.err)

        case "error":
            return h(ApplicationError, { err: state.err })
    }
}

function failedContent(err: LoadError): VNode {
    return loginError(
        html`アプリケーションの初期化に失敗しました`,
        html`
            <p>ロードに失敗しました</p>
            <p>(詳細: ${err.err})</p>
            <div class="vertical vertical_medium"></div>
            <p>お手数ですが、上記メッセージを管理者に伝えてください</p>
        `,
        html``,
    )
}

const EMPTY_CONTENT = html``