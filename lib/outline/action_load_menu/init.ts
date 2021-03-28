import { newLoadMenuLocationDetecter } from "../kernel/impl/init"
import { newLoadMenuInfra } from "../load_menu/impl/init"
import { newUpdateMenuBadgeInfra } from "../update_menu_badge/impl/init"
import { newToggleMenuExpandInfra } from "../toggle_menu_expand/impl/init"

import { initLoadMenuCoreAction, initLoadMenuCoreMaterial } from "./core/impl"

import { MenuContent } from "../kernel/infra"

import { LoadMenuResource } from "./resource"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newLoadMenuResource(
    feature: OutsideFeature,
    menuContent: MenuContent,
): LoadMenuResource {
    const { webStorage, currentLocation } = feature
    return {
        menu: initLoadMenuCoreAction(
            initLoadMenuCoreMaterial(
                {
                    ...newLoadMenuInfra(webStorage, menuContent),
                    ...newUpdateMenuBadgeInfra(menuContent),
                    ...newToggleMenuExpandInfra(webStorage, menuContent),
                },
                newLoadMenuLocationDetecter(currentLocation),
            ),
        ),
    }
}
