import { homeMenuContent } from "../../outline/menu/kernel/init/home"
import { newNotifyUnexpectedErrorResource } from "../../avail/action_unexpected_error/init"
import { newLoadBreadcrumbListResource } from "../../outline/menu/action_load_breadcrumb_list/init"
import { newLoadMenuResource } from "../../outline/menu/action_load_menu/init"
import { newLoadSeasonResource } from "../common/action_load_season/init"

import { BaseResource } from "./entry_point"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newBaseResource(feature: OutsideFeature): BaseResource {
    const menu = homeMenuContent()
    return {
        ...newLoadBreadcrumbListResource(feature, menu),
        ...newLoadMenuResource(feature, menu),
        ...newNotifyUnexpectedErrorResource(feature),
        ...newLoadSeasonResource(feature),
    }
}