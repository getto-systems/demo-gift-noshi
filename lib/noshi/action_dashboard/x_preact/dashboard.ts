import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { useApplicationView } from "../../../z_vendor/getto-application/action/x_preact/hooks"
import { useDocumentTitle } from "../../../x_preact/hooks"

import { copyright, siteInfo } from "../../site"

import { ApplicationErrorComponent } from "../../../avail/common/x_preact/application_error"
import { LoadSeasonEntry } from "../../common/action_load_season/x_preact/load_season"
import { LoadMenuEntry } from "../../../outline/action_load_menu/x_preact/load_menu"
import { LoadBreadcrumbListComponent } from "../../../outline/action_load_breadcrumb_list/x_preact/load_breadcrumb_list"
import { LoadSeasonFieldEntry } from "../../common/action_load_season/x_preact/load_season_field"

import { DashboardView, DashboardResource } from "../resource"
import { box_double, container } from "../../../z_vendor/getto-css/preact/design/box"

export function DashboardEntry(view: DashboardView): VNode {
    const resource = useApplicationView(view)

    const [err] = useErrorBoundary((err) => {
        // 認証していないのでエラーはどうしようもない
        console.log(err)
    })
    if (err) {
        return h(ApplicationErrorComponent, { err: `${err}` })
    }

    return h(DashboardComponent, resource)
}

const pageTitle = "ホーム" as const

export function DashboardComponent(resource: DashboardResource): VNode {
    useDocumentTitle(pageTitle)

    return appLayout({
        siteInfo,
        header: [h(LoadSeasonEntry, resource)],
        main: appMain({
            header: mainHeader([mainTitle(pageTitle), h(LoadBreadcrumbListComponent, resource)]),
            body: mainBody(h(NoshiComponent, resource)),
            copyright,
        }),
        menu: h(LoadMenuEntry, resource),
    })
}

function NoshiComponent(resource: DashboardResource): VNode {
    return container([
        box_double({
            title: "のし印刷",
            body: h(LoadSeasonFieldEntry, resource),
        }),
    ])
}
