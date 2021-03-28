import { env } from "../../../y_environment/env"

import { newMenuExpandRepository } from "../../kernel/infra/repository/menu_expand"

import { MenuContent } from "../../kernel/infra"
import { LoadMenuInfra } from "../infra"

export function newLoadMenuInfra(webStorage: Storage, menuContent: MenuContent): LoadMenuInfra {
    return {
        version: env.version,
        menuTree: menuContent.menuTree,
        menuExpand: newMenuExpandRepository(webStorage, menuContent.key),
    }
}
