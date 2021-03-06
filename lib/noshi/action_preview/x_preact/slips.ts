import { h, VNode } from "preact"
import { useMemo } from "preact/hooks"
import { html } from "htm/preact"

import { useApplicationAction } from "../../../z_vendor/getto-application/action/x_preact/hooks"

import {
    label_gray,
    label_success,
    label_warning,
    linky,
} from "../../../z_vendor/getto-css/preact/design/highlight"
import {
    tableColumn,
    tableHeader,
    table_fill_noMargin,
    tbody,
    thead,
} from "../../../z_vendor/getto-css/preact/design/data"

import { tableStructure } from "../../../z_vendor/getto-table/preact/cell/structure"
import { tableCell } from "../../../z_vendor/getto-table/preact/cell/simple"
import { tableAlign, tableClassName } from "../../../z_vendor/getto-table/preact/decorator"
import { visibleAll } from "../../../z_vendor/getto-table/preact/core"

import { PreviewSlipsResource, PreviewSlipsResourceState } from "../resource"

import { DeliverySlip } from "../../slip/data"

export function PreviewSlipsEntry(resource: PreviewSlipsResource): VNode {
    return h(PreviewSlipsComponent, {
        ...resource,
        state: useApplicationAction(resource.slips),
    })
}

type Props = PreviewSlipsResource & PreviewSlipsResourceState
export function PreviewSlipsComponent(props: Props): VNode {
    const structure = useMemo(buildStructure, [])

    switch (props.state.type) {
        case "initial-slips":
            return EMPTY_CONTENT

        case "succeed-to-load":
            return slipsTable(props.state.slips)
    }

    function slipsTable(slips: DeliverySlip[]) {
        const params = { visibleKeys: visibleAll, model: {} }

        const content = {
            sticky: structure.sticky(),
            header: structure.header(params),
        }

        return table_fill_noMargin(content.sticky, [
            thead(tableHeader(content)),
            tbody(
                slips.flatMap((slip) =>
                    tableColumn({ ...content, column: structure.column(params, slip) }),
                ),
            ),
        ])
    }
}

function buildStructure() {
    return tableStructure(key, [
        tableCell("printState", (_key) => ({
            label: "??????",
            header: linky,
            column: printState,
        })).border(["rightDouble"]),

        tableCell("name", (_key) => ({
            label: "?????????",
            header: linky,
            column: noshiName,
        })),

        tableCell("link", (_key) => ({
            label: "",
            header: linky,
            column: linkToSlip,
        })).decorateColumn(tableAlign(["right"])),
    ])
        .decorateRow(tableClassName(["row_hover"]))
        .stickyHeader()
        .freeze()

    function key(slip: DeliverySlip): string {
        return slip.data.number
    }

    function noshiName(slip: DeliverySlip): string {
        return slip.data.name
    }
    function printState(slip: DeliverySlip): VNode {
        switch (slip.printState) {
            case "done":
                return label_success("???")
            case "working":
                return label_warning("?????????")
            case "waiting":
                return label_gray("???")
        }
    }
    function linkToSlip(slip: DeliverySlip): VNode {
        return html`<a href="${slip.href}">??????</a>`
    }
}

const EMPTY_CONTENT = html``
