import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { useApplicationAction } from "../../../z_vendor/getto-application/action/x_preact/hooks"

import { notice_alert } from "../../../z_vendor/getto-css/preact/design/highlight"
import {
    buttons,
    button_send,
    button_undo,
    field,
} from "../../../z_vendor/getto-css/preact/design/form"
import { box, container_top } from "../../../z_vendor/getto-css/preact/design/box"

import { InputNoshiNameComponent } from "../../name/action_input/x_preact/input"

import { PreviewResource, PreviewResourceState } from "../resource"

import { DeliverySlipData, LoadCurrentDeliverySlipError } from "../../load_slips/data"

export function PreviewEntry(resource: PreviewResource): VNode {
    return h(PreviewComponent, {
        ...resource,
        state: useApplicationAction(resource.preview.core),
    })
}

type Props = PreviewResource & PreviewResourceState
export function PreviewComponent(props: Props): VNode {
    useEffect(() => {
        switch (props.state.type) {
            case "succeed-to-load":
            // appendLink(props.state.slip)
        }

        function _appendLink(slip: DeliverySlipData) {
            const link = document.createElement("link")
            link.setAttribute("rel", "stylesheet")
            link.setAttribute("href", `/dist/css/${slip.size.toLowerCase()}.css`)
            document.body.appendChild(link)
        }
    }, [props.state])

    switch (props.state.type) {
        case "initial-preview":
            return EMPTY_CONTENT

        case "failed-to-load":
            return box({
                title: "ロードエラー",
                body: notice_alert(loadError(props.state.err)),
            })

        case "succeed-to-load":
            return preview(props.state.slip)
    }

    function preview(slip: DeliverySlipData): VNode {
        return container_top([noshi(), form()])

        function noshi(): VNode {
            return html`<article class="noshi noshi_${slip.size.toLowerCase()}">
                <div class="noshi__scale"><section class="noshi__body">ここに名入れ</section></div>
            </article>`
        }
        function form(): VNode {
            return box({
                title: "のし",
                body: [
                    field({
                        title: "区分",
                        body: slip.type,
                    }),
                    field({
                        title: "サイズ",
                        body: slip.size,
                    }),
                    h(InputNoshiNameComponent, { field: props.preview.form.noshiName }),
                ],
                footer: buttons({
                    left: printButton(),
                    right: resetButton(),
                }),
            })
        }

        function printButton(): VNode {
            return button_send({ label: "印刷", state: "confirm", onClick })

            function onClick(e: Event) {
                e.preventDefault()
                alert("ここで印刷！")
            }
        }
        function resetButton(): VNode {
            return button_undo({ label: "元に戻す", onClick })

            function onClick() {
                props.preview.form.reset()
            }
        }
    }
}

function loadError(err: LoadCurrentDeliverySlipError): string {
    switch (err.type) {
        case "empty":
            return "伝票データが読み込まれていません"

        case "not-found":
            return "伝票データのリンクが切れています"
    }
}

const EMPTY_CONTENT = html``
