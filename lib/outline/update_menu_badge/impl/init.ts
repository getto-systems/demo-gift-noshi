import { env } from "../../../y_environment/env"

import { newGetMenuBadgeNoopRemote } from "../../kernel/infra/remote/get_menu_badge/noop"

import { UpdateMenuBadgeInfra } from "../infra"
import { MenuContent } from "../../kernel/infra"

export function newUpdateMenuBadgeInfra(menuContent: MenuContent): UpdateMenuBadgeInfra {
    return {
        version: env.version,
        menuTree: menuContent.menuTree,
        getMenuBadge: newGetMenuBadgeNoopRemote(),
    }
}
