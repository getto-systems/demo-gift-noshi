import { h, VNode } from "preact"
import { html } from "htm/preact"

import { useApplicationAction } from "../../../../z_vendor/getto-application/action/x_preact/hooks"

import { label_alert } from "../../../../z_vendor/getto-css/preact/design/highlight"

import { VNodeContent } from "../../../../x_preact/design/common"

import { seasonPeriod } from "./period"

import { LoadSeasonResource, LoadSeasonResourceState } from "../resource"

import { Season } from "../../load_season/data"
import { RepositoryError } from "../../../../z_vendor/getto-application/infra/repository/data"

export function LoadSeasonEntry(resource: LoadSeasonResource): VNode {
    return h(LoadSeasonComponent, { ...resource, state: useApplicationAction(resource.season) })
}

type Props = LoadSeasonResource & LoadSeasonResourceState
export function LoadSeasonComponent(props: Props): VNode {
    return info(body())

    function body(): VNodeContent {
        switch (props.state.type) {
            case "initial-season":
                return EMPTY_CONTENT

            case "succeed-to-load":
                return seasonContent(props.state.value)

            case "failed-to-load":
                return errorContent(props.state.err)
        }
    }
}

function info(body: VNodeContent) {
    return html`<small>シーズン:</small> ${body}`
}

function seasonContent(season: Season) {
    return `${season.year}年 ${seasonPeriod(season.period)}`
}
function errorContent(err: RepositoryError) {
    return [label_alert("ロードエラー"), ...detail()]

    function detail(): VNode[] {
        if (err.err.length === 0) {
            return []
        }
        return [html` <small>詳細: ${err.err}</small>`]
    }
}

const EMPTY_CONTENT = html``
