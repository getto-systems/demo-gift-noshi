import { h, VNode } from "preact"

import { useApplicationView } from "../../../z_vendor/getto-application/action/x_preact/hooks"
import { useNotifyUnexpectedError } from "../../../avail/action_notify_unexpected_error/x_preact/hooks"
import { useDocumentTitle } from "../../../x_preact/common/hooks"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { copyright, siteInfo } from "../../../x_preact/common/site"

import { ApplicationErrorComponent } from "../../../avail/common/x_preact/application_error"
import { LoadMenuEntry } from "../../../outline/action_load_menu/x_preact/load_menu"
import { LoadBreadcrumbListComponent } from "../../../outline/action_load_breadcrumb_list/x_preact/load_breadcrumb_list"
import { docsArticle } from "./content"

import { DocsView, DocsResource } from "../resource"
import { DocsSection } from "../../../z_vendor/getto-application/docs/data"

export type DocsContent = Readonly<{
    title: string
    contents: DocsSection[][][]
}>

interface Entry {
    (view: DocsView): VNode
}

export function DocsEntry(docs: DocsContent): Entry {
    return (view) => {
        const resource = useApplicationView(view)

        const err = useNotifyUnexpectedError(resource)
        if (err) {
            return h(ApplicationErrorComponent, { err: `${err}` })
        }

        return h(DocsComponent, { ...resource, docs })
    }
}

type Props = DocsResource & Readonly<{ docs: DocsContent }>
export function DocsComponent(resource: Props): VNode {
    useDocumentTitle(resource.docs.title)

    return appLayout({
        siteInfo: siteInfo(),
        header: [],
        main: appMain({
            header: mainHeader([
                mainTitle(resource.docs.title),
                h(LoadBreadcrumbListComponent, resource),
            ]),
            body: mainBody(docsArticle(resource.docs.contents)),
            copyright: copyright(),
        }),
        menu: h(LoadMenuEntry, resource),
    })
}
