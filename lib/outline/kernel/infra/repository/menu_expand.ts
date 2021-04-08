import { newDB_MenuExpand } from "../../../../z_details/db/outline/menu_expand"
import { wrapRepository } from "../../../../z_vendor/getto-application/infra/repository/helper"

import { MenuExpandRepositoryPod } from "../../infra"

export function newMenuExpandRepository(webStorage: Storage, key: string): MenuExpandRepositoryPod {
    return wrapRepository(newDB_MenuExpand(webStorage, key))
}
