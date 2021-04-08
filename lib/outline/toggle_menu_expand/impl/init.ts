import { env } from "../../../y_environment/env"

import { newMenuExpandRepositoryPod } from "../../kernel/infra/repository/menu_expand"

import { MenuContent } from "../../kernel/infra"
import { ToggleMenuExpandInfra } from "../infra"
import { RepositoryOutsideFeature } from "../../../z_vendor/getto-application/infra/repository/infra"

export function newToggleMenuExpandInfra(
    feature: RepositoryOutsideFeature,
    menuContent: MenuContent,
): ToggleMenuExpandInfra {
    return {
        version: env.version,
        menuTree: menuContent.menuTree,
        menuExpand: newMenuExpandRepositoryPod(feature, menuContent),
    }
}
