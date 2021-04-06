import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"

import {
    appLayout,
    appMain,
    appSidebar,
    mainBody,
    mainHeader,
    mainTitle,
    sidebarBody_grow,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { useApplicationView } from "../../../z_vendor/getto-application/action/x_preact/hooks"
import { useDocumentTitle } from "../../../x_preact/hooks"

import { copyright, siteInfo } from "../../site"

import { ApplicationErrorComponent } from "../../../avail/common/x_preact/application_error"
import { LoadSeasonComponent } from "../../common/action_load_season/x_preact/load_season"
import { LoadMenuEntry } from "../../../outline/action_load_menu/x_preact/load_menu"
import { LoadBreadcrumbListComponent } from "../../../outline/action_load_breadcrumb_list/x_preact/load_breadcrumb_list"
import { PreviewEntry } from "../../action_preview/x_preact/preview"
import { PreviewSlipsEntry } from "../../action_preview/x_preact/slips"

import { PrintView, PrintResource } from "../resource"

export function PrintEntry(view: PrintView): VNode {
    const resource = useApplicationView(view)

    const [err] = useErrorBoundary((err) => {
        // 認証していないのでエラーはどうしようもない
        console.log(err)
    })
    if (err) {
        return h(ApplicationErrorComponent, { err: `${err}` })
    }

    return h(PrintComponent, resource)
}

const pageTitle = "印刷" as const

export function PrintComponent(resource: PrintResource): VNode {
    useDocumentTitle(pageTitle)

    return appLayout({
        siteInfo,
        header: [h(LoadSeasonComponent, resource)],
        main: appMain({
            header: mainHeader([mainTitle(pageTitle), h(LoadBreadcrumbListComponent, resource)]),
            body: mainBody(h(PreviewEntry, resource)),
            copyright,
        }),
        sidebar: appSidebar({
            header: mainHeader(mainTitle("伝票一覧")),
            body: [sidebarBody_grow(h(PreviewSlipsEntry, resource.preview))],
            copyright,
        }),
        menu: h(LoadMenuEntry, resource),
    })
}
