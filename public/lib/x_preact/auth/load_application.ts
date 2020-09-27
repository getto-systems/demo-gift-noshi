import { h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { loginError } from "../layout"

import { ApplicationError } from "../application_error"

import { unpackScriptPath } from "../../script/adapter"

import {
    LoadApplicationComponent,
    LoadApplicationParam,
    initialLoadApplicationState,
    LoadError,
} from "../../auth/component/load_application/component"

type Props = Readonly<{
    component: LoadApplicationComponent
    param: LoadApplicationParam
}>

export function LoadApplication(props: Props): VNode {
    const [state, setState] = useState(initialLoadApplicationState)
    useEffect(() => {
        props.component.onStateChange(setState)
        return props.component.init()
    }, [])

    useEffect(() => {
        props.component.trigger({ type: "set-param", param: props.param })
    }, [props.param])

    useEffect(() => {
        if (state.type === "initial-load") {
            props.component.trigger({ type: "load" })
        }
    }, [state])

    useEffect(() => {
        // script タグは body.appendChild しないとスクリプトがロードされないので useEffect で追加する
        if (state.type === "try-to-load") {
            const script = document.createElement("script")
            script.src = unpackScriptPath(state.scriptPath)
            script.onload = () => {
                props.component.trigger({ type: "succeed-to-load" })
            }
            script.onerror = (err) => {
                props.component.trigger({ type: "failed-to-load", err: { type: "infra-error", err: `${err}` } })
            }
            document.body.appendChild(script)
        }
    }, [state])

    switch (state.type) {
        case "initial-load":
        case "succeed-to-load":
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
