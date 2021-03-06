import { menuBadgeRemoteConverter } from "../../kernel/impl/converter"

import { buildMenu, BuildMenuParams } from "../../kernel/impl/menu"

import { initMenuExpand, MenuBadge } from "../../kernel/infra"
import { UpdateMenuBadgeInfra, UpdateMenuBadgeStore } from "../infra"

import { UpdateMenuBadgePod } from "../method"

interface Update {
    (infra: UpdateMenuBadgeInfra, store: UpdateMenuBadgeStore): UpdateMenuBadgePod
}
export const updateMenuBadge: Update = (infra, store) => (detecter) => async (post) => {
    const getMenuBadge = infra.getMenuBadge(menuBadgeRemoteConverter)

    const fetchResult = store.menuExpand.get()
    const expand = fetchResult.found ? fetchResult.value : initMenuExpand()

    const buildParams: BuildMenuParams = {
        version: infra.version,
        menuExpand: expand,
        menuTargetPath: detecter(),
        menuTree: infra.menuTree,
        menuBadge: EMPTY_BADGE,
    }

    const response = await getMenuBadge({ type: "always" })
    if (!response.success) {
        return post({ type: "failed-to-update", menu: buildMenu(buildParams), err: response.err })
    }

    store.menuBadge.set(response.value)

    return post({
        type: "succeed-to-update",
        menu: buildMenu({ ...buildParams, menuBadge: response.value }),
    })
}

const EMPTY_BADGE: MenuBadge = new Map()
