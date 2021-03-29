import { ApplicationView } from "../../z_vendor/getto-application/action/action"

import { LoadBreadcrumbListResource } from "../../outline/action_load_breadcrumb_list/resource"
import { LoadMenuResource } from "../../outline/action_load_menu/resource"
import { LoadSeasonResource } from "../common/action_load_season/resource"

export type BaseTypes<R> = {
    view: BaseView<R>
    resource: R & BaseResource
}

export type BaseView<R> = ApplicationView<R & BaseResource>

export type BaseResource = LoadBreadcrumbListResource & LoadMenuResource & LoadSeasonResource
