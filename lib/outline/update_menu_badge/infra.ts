import { GetMenuBadgeRemotePod, MenuBadgeStore, MenuExpandStore, MenuTree } from "../kernel/infra"

export type UpdateMenuBadgeInfra = Readonly<{
    version: string
    menuTree: MenuTree
    getMenuBadge: GetMenuBadgeRemotePod
}>

export type UpdateMenuBadgeStore = Readonly<{
    menuExpand: MenuExpandStore
    menuBadge: MenuBadgeStore
}>
