import { h, VNode } from "preact"
import { html } from "htm/preact"

import { useApplicationAction } from "../../../z_vendor/getto-application/action/x_preact/hooks"

import { notice_alert } from "../../../z_vendor/getto-css/preact/design/highlight"
import { buttons, button_send, field } from "../../../z_vendor/getto-css/preact/design/form"
import { box, container, container_top } from "../../../z_vendor/getto-css/preact/design/box"

import { PreviewResource, PreviewResourceState } from "../resource"

import { DeliverySlipData } from "../../slip/data"
import { LoadCurrentDeliverySlipError, NextDeliverySlipHref } from "../../load_slips/data"
import { PrintDeliverySlipsError } from "../../print_slips/data"

export function PreviewEntry(resource: PreviewResource): VNode {
    return h(PreviewComponent, {
        ...resource,
        state: useApplicationAction(resource.preview.core),
    })
}

type Props = PreviewResource & PreviewResourceState
export function PreviewComponent(props: Props): VNode {
    switch (props.state.type) {
        case "initial-preview":
            return EMPTY_CONTENT

        case "succeed-to-load":
            return preview(props.state.slip, props.state.next)

        case "try-to-print":
            return container(
                box({
                    title: "データ作成中",
                    body: "印刷用エクセルを作成しています",
                }),
            )

        case "succeed-to-print":
            return download(props.state.href)

        case "failed-to-load":
            return container(
                box({
                    title: "ロードエラー",
                    body: notice_alert(loadError(props.state.err)),
                }),
            )
        case "failed-to-print":
            return container(
                box({
                    title: "印刷エラー",
                    body: notice_alert(printError(props.state.err)),
                }),
            )
    }

    function preview(slip: DeliverySlipData, nextSlip: NextDeliverySlipHref): VNode {
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
                    field({
                        title: "名入れ",
                        body: html`<input type="text" disabled value="${slip.name}" />`,
                        help: ["(プレビュー版では変更できません)"],
                    }),
                ],
                footer: buttons({
                    left: nextSlipButton(),
                }),
            })
        }

        function nextSlipButton(): VNode {
            if (nextSlip.hasNext) {
                return button_send({ label: "次へ", state: "confirm", onClick })
            } else {
                return button_send({ label: "印刷", state: "confirm", onClick })
            }

            function onClick(e: Event) {
                e.preventDefault()

                if (nextSlip.hasNext) {
                    location.href = nextSlip.href
                } else {
                    props.preview.core.print()
                }
            }
        }
    }
    function download(href: string): VNode {
        return container(
            box({
                title: "印刷用エクセル",
                body: downloadLink(),
                footer: resetLink()
            }),
        )

        function downloadLink(): VNode {
            return html`<a href="${href}" download="のし.xlsx">ダウンロード</a>`
        }
        function resetLink(): VNode {
            return html`<a href="?">リセット</a>`
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
function printError(err: PrintDeliverySlipsError): string {
    switch (err.type) {
        case "infra-error":
            return `詳細: ${err.err}`
    }
}

const EMPTY_CONTENT = html``
