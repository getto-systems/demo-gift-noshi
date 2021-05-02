import { menuExpandRepositoryConverter } from "../../kernel/impl/converter"

import { buildMenu } from "../../kernel/impl/menu"

import { initMenuExpand, MenuBadge, MenuExpand } from "../../kernel/infra"
import { ToggleMenuExpandInfra, ToggleMenuExpandStore } from "../infra"

import { ToggleMenuExpandPod } from "../method"

import { MenuCategoryPath } from "../../kernel/data"

interface Toggle {
    (infra: ToggleMenuExpandInfra, store: ToggleMenuExpandStore): ToggleMenuExpandPod
}

export const showMenuExpand: Toggle = modifyMenuExpand((expand, path) => expand.register(path))
export const hideMenuExpand: Toggle = modifyMenuExpand((expand, path) => expand.remove(path))

interface ModifyExpand {
    (expand: MenuExpand, path: MenuCategoryPath): void
}
function modifyMenuExpand(modify: ModifyExpand): Toggle {
    return (infra, store) => (detecter) => async (path, post) => {
        const menuExpand = infra.menuExpand(menuExpandRepositoryConverter)

        const fetchMenuExpandResult = store.menuExpand.get()
        const expand = fetchMenuExpandResult.found ? fetchMenuExpandResult.value : initMenuExpand()

        modify(expand, path)

        const storeResult = await menuExpand.set(expand)
        if (!storeResult.success) {
            return post({ type: "repository-error", err: storeResult.err })
        }

        store.menuExpand.set(expand)

        const fetchMenuBadgeResult = store.menuBadge.get()
        const badge = fetchMenuBadgeResult.found ? fetchMenuBadgeResult.value : EMPTY_BADGE

        return post({
            type: "succeed-to-toggle",
            menu: buildMenu({
                version: infra.version,
                menuTree: infra.menuTree,
                menuTargetPath: detecter(),
                menuExpand: expand,
                menuBadge: badge,
            }),
        })
    }
}

const EMPTY_BADGE: MenuBadge = new Map()
