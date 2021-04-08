import { newDB_MenuExpand } from "../../../../z_details/db/outline/menu_expand"

import { convertRepository } from "../../../../z_vendor/getto-application/infra/repository/helper"

import { RepositoryOutsideFeature } from "../../../../z_vendor/getto-application/infra/repository/infra"
import { MenuExpandRepositoryPod } from "../../infra"

export type MenuExpandRepositoryParams = Readonly<{
    database: string
    key: string
}>
export function newMenuExpandRepositoryPod(
    feature: RepositoryOutsideFeature,
    params: MenuExpandRepositoryParams,
): MenuExpandRepositoryPod {
    return convertRepository(newDB_MenuExpand(feature, params))
}
