import { MenuExpandRepositoryPod, MenuExpandStore, MenuTree } from "../kernel/infra"

export type LoadMenuInfra = Readonly<{
    version: string
    menuTree: MenuTree
    menuExpand: MenuExpandRepositoryPod
}>

export type LoadMenuStore = Readonly<{
    menuExpand: MenuExpandStore
}>
