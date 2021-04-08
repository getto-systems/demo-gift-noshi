import { newLoadMenuLocationDetecter } from "../kernel/impl/init"
import { newLoadMenuInfra } from "../load_menu/impl/init"
import { newUpdateMenuBadgeInfra } from "../update_menu_badge/impl/init"
import { newToggleMenuExpandInfra } from "../toggle_menu_expand/impl/init"

import { initLoadMenuCoreAction, initLoadMenuCoreMaterial } from "./core/impl"

import { MenuContent } from "../kernel/infra"

import { LoadMenuResource } from "./resource"
import { LocationOutsideFeature } from "../../z_vendor/getto-application/location/infra"
import { RepositoryOutsideFeature } from "../../z_vendor/getto-application/infra/repository/infra"

export function newLoadMenuResource(
    feature: RepositoryOutsideFeature & LocationOutsideFeature,
    menuContent: MenuContent,
): LoadMenuResource {
    return {
        menu: initLoadMenuCoreAction(
            initLoadMenuCoreMaterial(
                {
                    ...newLoadMenuInfra(feature, menuContent),
                    ...newUpdateMenuBadgeInfra(menuContent),
                    ...newToggleMenuExpandInfra(feature, menuContent),
                },
                newLoadMenuLocationDetecter(feature),
            ),
        ),
    }
}
