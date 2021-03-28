import { VNode } from "preact"
import { html } from "htm/preact"

import { box_double } from "../../../../z_vendor/getto-css/preact/design/box"
import { field } from "../../../../z_vendor/getto-css/preact/design/form"
import { notice_alert } from "../../../../z_vendor/getto-css/preact/design/highlight"
import { v_small } from "../../../../z_vendor/getto-css/preact/design/alignment"

import { VNodeContent } from "../../../../x_preact/design/common"

import { LoadSeasonResource } from "../resource"

import { RepositoryError } from "../../../../z_vendor/getto-application/infra/repository/data"
import { Season } from "../../load_season/data"

export function ExampleComponent(resource: LoadSeasonResource): VNode {
    const result = resource.season.load()
    if (!result.success) {
        return seasonBox(loadError(result.err))
    }
    return seasonBox(seasonInfo(result.value))
}

function seasonBox(body: VNodeContent): VNode {
    return box_double({
        title: "GETTO Example",
        body: field({
            title: "シーズン",
            body,
        }),
    })
}

function seasonInfo(season: Season): VNodeContent {
    return season.year
}

function loadError(err: RepositoryError): VNodeContent {
    return [notice_alert("ロードエラー"), ...detail()]

    function detail(): VNode[] {
        if (err.err.length === 0) {
            return []
        }
        return [v_small(), html`<small><p>詳細: ${err.err}</p></small>`]
    }
}
