import { docsMenuContent } from "../../outline/kernel/init/docs"
import { newLoadBreadcrumbListResource } from "../../outline/action_load_breadcrumb_list/init"
import { newLoadMenuResource } from "../../outline/action_load_menu/init"

import { initDocsView } from "./impl"

import { RepositoryOutsideFeature } from "../../z_vendor/getto-application/infra/repository/infra"
import { LocationOutsideFeature } from "../../z_vendor/getto-application/location/infra"

import { DocsView } from "./resource"

type OutsideFeature = LocationOutsideFeature & RepositoryOutsideFeature
export function newDocsView(feature: OutsideFeature): DocsView {
    const menu = docsMenuContent()
    return initDocsView({
        ...newLoadBreadcrumbListResource(feature, menu),
        ...newLoadMenuResource(feature, menu),
    })
}
