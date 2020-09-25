import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { ErrorView } from "./layout"

import { unpackScriptPath } from "../../script/adapter"

import {
    LoadApplicationComponent,
    LoadApplicationParam,
    initialLoadApplicationState,
    CheckError,
} from "../../auth/component/load_application/component"

export interface PreactComponent {
    (props: Props): VNode
}

type Props = Readonly<{
    param: LoadApplicationParam
}>

export function LoadApplication(component: LoadApplicationComponent): PreactComponent {
    return (props: Props): VNode => {
        const [state, setState] = useState(initialLoadApplicationState)
        useEffect(() => {
            component.onStateChange(setState)
            component.init()
            component.trigger({ type: "load", param: props.param })
            return () => component.terminate()
        }, [])

        useEffect(() => {
            // script タグは body.appendChild しないとスクリプトがロードされないので useEffect で追加する
            if (state.type === "try-to-load") {
                const script = document.createElement("script")
                script.src = unpackScriptPath(state.scriptPath)
                script.onerror = (_err) => {
                    setState({ type: "failed-to-load", err: { type: "not-found" } })
                }
                document.body.appendChild(script)
            }
        }, [state])

        switch (state.type) {
            case "initial-load":
                return html``

            case "try-to-load":
                // script の追加は appendScript でするので、本体は空で返す
                return html``

            case "failed-to-load":
                return failedContent(state.err)
        }
    }

    function failedContent(_err: CheckError): VNode {
        return ErrorView(
            html`アプリケーションの初期化に失敗しました`,
            html`
                ${errorMessage()}
                <div class="vertical vertical_medium"></div>
                <p>お手数ですが、上記メッセージを管理者に伝えてください</p>
            `,
            html``,
        )

        function errorMessage(): VNode {
            return html`<p>スクリプトが見つかりませんでした</p>`
        }
    }
}
