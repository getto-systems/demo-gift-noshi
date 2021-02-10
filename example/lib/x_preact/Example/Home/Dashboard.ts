import { h, VNode } from "preact"
import { useEffect, useErrorBoundary } from "preact/hooks"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { useTerminate } from "../../common/hooks"
import { copyright, siteInfo } from "../../common/site"

import { ApplicationError } from "../../common/System/ApplicationError"
import { SeasonInfo } from "../../Outline/SeasonInfo"
import { MenuList } from "../../Outline/MenuList"
import { BreadcrumbList } from "../../Outline/BreadcrumbList"
import { Example } from "./Example"

import { DashboardEntryPoint } from "../../../example/Home/Dashboard/entryPoint"

type Props = Readonly<{
    dashboard: DashboardEntryPoint
}>
export function Dashboard({ dashboard: { resource, terminate } }: Props): VNode {
    const [err] = useErrorBoundary((err) => {
        // TODO ここでエラーをどこかに投げたい。apiCredential が有効なはずなので、api にエラーを投げられるはず
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    useTerminate(terminate)

    useEffect(() => {
        document.title = `ホーム | ${document.title}`
    }, [])

    return appLayout({
        siteInfo: siteInfo(),
        header: [h(SeasonInfo, resource)],
        main: appMain({
            header: mainHeader([mainTitle("ホーム"), h(BreadcrumbList, resource)]),
            body: mainBody(h(Example, resource)),
            copyright: copyright(),
        }),
        menu: h(MenuList, resource),
    })
}