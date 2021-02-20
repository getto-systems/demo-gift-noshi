import { ApplicationAction } from "../../../../../z_getto/application/action"

import { LoadOutlineBreadcrumbListAction } from "../../../../../auth/permission/outline/load/action"

import { OutlineBreadcrumb } from "../../../../../auth/permission/outline/load/data"

export interface BreadcrumbListComponentFactory {
    (material: BreadcrumbListMaterial): BreadcrumbListComponent
}
export type BreadcrumbListMaterial = Readonly<{
    breadcrumbList: LoadOutlineBreadcrumbListAction
}>

export type BreadcrumbListComponent = ApplicationAction<BreadcrumbListComponentState>

export type BreadcrumbListComponentState =
    | Readonly<{ type: "initial-breadcrumb-list" }>
    | Readonly<{ type: "succeed-to-load"; breadcrumb: OutlineBreadcrumb }>

export const initialBreadcrumbListComponentState: BreadcrumbListComponentState = {
    type: "initial-breadcrumb-list",
}
