import { homeMenuContent } from "../../outline/kernel/init/home"
import { newLoadBreadcrumbListResource } from "../../outline/action_load_breadcrumb_list/init"
import { newLoadMenuResource } from "../../outline/action_load_menu/init"
import { newLoadSeasonResource } from "../common/action_load_season/init"

import { BaseResource } from "./resource"

export type BaseOutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newBaseResource(feature: BaseOutsideFeature): BaseResource {
    const menu = homeMenuContent()
    return {
        ...newLoadBreadcrumbListResource(feature, menu),
        ...newLoadMenuResource(feature, menu),
        ...newLoadSeasonResource(feature),
    }
}
