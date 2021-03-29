import { mockLoadBreadcrumbListResource } from "../../outline/action_load_breadcrumb_list/mock"
import { mockLoadMenuResource } from "../../outline/action_load_menu/mock"
import { mockLoadSeasonResource } from "../common/action_load_season/mock"

import { BaseResource } from "./resource"

export function mockBaseResource(): BaseResource {
    return {
        ...mockLoadBreadcrumbListResource(),
        ...mockLoadMenuResource(),
        ...mockLoadSeasonResource(),
    }
}
