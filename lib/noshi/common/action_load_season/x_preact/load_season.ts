import { VNode } from "preact"
import { html } from "htm/preact"

import { label_alert } from "../../../../z_vendor/getto-css/preact/design/highlight"

import { VNodeContent } from "../../../../x_preact/design/common"

import { LoadSeasonResource } from "../resource"

import { Season } from "../../load_season/data"
import { RepositoryError } from "../../../../z_vendor/getto-application/infra/repository/data"

export function LoadSeasonComponent(resource: LoadSeasonResource): VNode {
    const result = resource.season.load()
    if (!result.success) {
        return info(errorContent(result.err))
    }
    return info(seasonContent(result.value))
}

function info(body: VNodeContent) {
    return html`<small>シーズン:</small> ${body}`
}

function seasonContent(season: Season) {
    return `${season.year}年 ${period()}`

    function period(): VNodeContent {
        switch (season.period) {
            case "summer":
                return "夏"

            case "winter":
                return "冬"
        }
    }
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
