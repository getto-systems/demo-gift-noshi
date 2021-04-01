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
import { box_fill } from "../../../z_vendor/getto-css/preact/design/box"
import {
    table,
    tableColumn,
    tableHeader,
    tbody,
    thead,
} from "../../../z_vendor/getto-css/preact/design/data"

import { tableStructure } from "../../../z_vendor/getto-table/preact/cell/structure"
import { tableCell } from "../../../z_vendor/getto-table/preact/cell/simple"
import { tableClassName } from "../../../z_vendor/getto-table/preact/decorator"
import { visibleAll } from "../../../z_vendor/getto-table/preact/core"

import { PreviewSlipsResource, PreviewSlipsResourceState } from "../resource"

import { DeliverySlip } from "../../load_slips/data"

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

        return box_fill({
            body: table(content.sticky, [
                thead(tableHeader(content)),
                tbody(
                    slips.flatMap((slip) =>
                        tableColumn({ ...content, column: structure.column(params, slip) }),
                    ),
                ),
            ]),
        })
    }
}

function buildStructure() {
    return tableStructure<EMPTY_MODEL, DeliverySlip>({
        key: (slip: DeliverySlip) => slip.data.number,
        cells: [
            tableCell("hasPrinted", (_key) => ({
                label: () => "印刷",
                header: linky,
                column: (slip: DeliverySlip) => {
                    switch (slip.printState) {
                        case "done":
                            return label_success("済")
                        case "working":
                            return label_warning("作業中")
                        case "waiting":
                            return label_gray("未")
                    }
                },
            })).border(["rightDouble"]),

            tableCell("name", (_key) => ({
                label: () => "名入れ",
                header: linky,
                column: (slip: DeliverySlip) => slip.data.name,
            })),
        ],
    })
        .horizontalBorder_header(["topNone"])
        .decorateRow(tableClassName(["row_hover"]))
        .stickyHeader()
        .freeze()
}

type EMPTY_MODEL = {
    // no props
}
const EMPTY_CONTENT = html``
