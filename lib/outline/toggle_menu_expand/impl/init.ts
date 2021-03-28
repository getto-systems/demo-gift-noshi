import { env } from "../../../y_environment/env"

import { newMenuExpandRepository } from "../../kernel/infra/repository/menu_expand"

import { MenuContent } from "../../kernel/infra"
import { ToggleMenuExpandInfra } from "../infra"

export function newToggleMenuExpandInfra(
    webStorage: Storage,
    menuContent: MenuContent,
): ToggleMenuExpandInfra {
    return {
        version: env.version,
        menuTree: menuContent.menuTree,
        menuExpand: newMenuExpandRepository(webStorage, menuContent.key),
    }
}
