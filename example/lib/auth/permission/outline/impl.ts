import { LoadApiCredentialResult } from "../../../common/apiCredential/infra"
import {
    MenuBadge,
    MenuExpand,
    MenuTree,
    MenuTreeNode,
    MenuTreeCategory,
    MenuTreeItem,
    MenuCategoryPathSet,
    MenuActionInfra,
    LoadBreadcrumbList,
    LoadMenu,
    ToggleMenuExpand,
    BreadcrumbListActionInfra,
} from "./infra"

import { BreadcrumbListAction, MenuAction, OutlineActionLocationInfo } from "./action"

import { ApiRoles, emptyApiRoles } from "../../../common/apiCredential/data"
import {
    Breadcrumb,
    BreadcrumbNode,
    Menu,
    MenuCategory,
    MenuItem,
    markMenuItem,
    MenuNode,
    MenuTarget,
    MenuCategoryPath,
    markMenuCategoryLabel,
    MenuCategoryLabel,
    markMenuTarget,
} from "./data"

export function initOutlineActionLocationInfo(
    version: string,
    currentURL: URL
): OutlineActionLocationInfo {
    return {
        getMenuTarget: () => detectMenuTarget(version, currentURL),
    }
}

function detectMenuTarget(version: string, currentURL: URL): MenuTarget {
    const pathname = currentURL.pathname
    const versionPrefix = `/${version}/`
    if (!pathname.startsWith(versionPrefix)) {
        return markMenuTarget({ versioned: false, version })
    }
    return markMenuTarget({
        versioned: true,
        version,
        currentPath: pathname.replace(versionPrefix, "/"),
    })
}

export function initBreadcrumbListAction(
    locationInfo: OutlineActionLocationInfo,
    infra: BreadcrumbListActionInfra
): BreadcrumbListAction {
    return {
        loadBreadcrumbList: loadBreadcrumbList(infra)(locationInfo),
    }
}

export function initMenuAction(
    locationInfo: OutlineActionLocationInfo,
    infra: MenuActionInfra
): MenuAction {
    return {
        loadMenu: loadMenu(infra)(locationInfo),
        toggleMenuExpand: toggleMenuExpand(infra)(),
    }
}

const loadBreadcrumbList: LoadBreadcrumbList = (infra) => (locationInfo) => async (post) => {
    const { menuTree } = infra

    post({
        type: "succeed-to-load",
        breadcrumb: toBreadcrumb({
            menuTree,
            menuTarget: locationInfo.getMenuTarget(),
        }),
    })
}

type BreadcrumbInfo = Readonly<{
    menuTree: MenuTree
    menuTarget: MenuTarget
}>

function toBreadcrumb({ menuTree, menuTarget }: BreadcrumbInfo): Breadcrumb {
    if (!menuTarget.versioned) {
        return []
    }
    const { version, currentPath } = menuTarget

    return menuTreeToBreadcrumb(menuTree)

    function menuTreeToBreadcrumb(menuTree: MenuTree): Breadcrumb {
        for (let i = 0; i < menuTree.length; i++) {
            const breadcrumb = breadcrumbNodes(menuTree[i])
            if (breadcrumb.length > 0) {
                return breadcrumb
            }
        }
        return EMPTY_BREADCRUMB
    }
    function breadcrumbNodes(node: MenuTreeNode): BreadcrumbNode[] {
        switch (node.type) {
            case "category":
                return breadcrumbCategory(node.category, node.children)
            case "item":
                return breadcrumbItem(node.item)
        }
    }
    function breadcrumbCategory(category: MenuTreeCategory, children: MenuTree): BreadcrumbNode[] {
        const breadcrumb = menuTreeToBreadcrumb(children)
        if (breadcrumb.length === 0) {
            return EMPTY_BREADCRUMB
        }
        return [{ type: "category", category: toMenuCategory(category) }, ...breadcrumb]
    }
    function breadcrumbItem(item: MenuTreeItem): BreadcrumbNode[] {
        if (item.path !== currentPath) {
            return EMPTY_BREADCRUMB
        }
        return [{ type: "item", item: toMenuItem(item, version) }]
    }
}

const loadMenu: LoadMenu = (infra) => (locationInfo) => async (post) => {
    const { apiCredentials, menuTree, menuExpands, loadMenuBadge } = infra

    const result = apiCredentials.load()

    const info: MenuInfo = {
        menuTree: menuTree,
        roles: apiRoles(result),
        menuTarget: locationInfo.getMenuTarget(),
    }

    const menuExpandResponse = menuExpands.load()
    if (!menuExpandResponse.success) {
        post({
            type: "failed-to-load",
            menu: toMenu(info, EMPTY_EXPAND, EMPTY_BADGE),
            err: menuExpandResponse.err,
        })
        return
    }

    // badge の取得には時間がかかる可能性があるのでまず空 badge で返す
    // expand の取得には時間がかからないはずなので expand の取得前には返さない
    post({
        type: "succeed-to-instant-load",
        menu: toMenu(info, menuExpandResponse.menuExpand, EMPTY_BADGE),
    })

    if (!result.success) {
        post({
            type: "failed-to-load",
            menu: toMenu(info, menuExpandResponse.menuExpand, EMPTY_BADGE),
            err: result.err,
        })
        return
    }
    if (!result.found) {
        post({
            type: "failed-to-load",
            menu: toMenu(info, menuExpandResponse.menuExpand, EMPTY_BADGE),
            err: { type: "empty-nonce" },
        })
        return
    }

    const menuBadgeResponse = await loadMenuBadge(result.apiCredential.apiNonce)
    if (!menuBadgeResponse.success) {
        post({
            type: "failed-to-load",
            menu: toMenu(info, menuExpandResponse.menuExpand, EMPTY_BADGE),
            err: menuBadgeResponse.err,
        })
        return
    }

    post({
        type: "succeed-to-load",
        menu: toMenu(info, menuExpandResponse.menuExpand, menuBadgeResponse.value),
    })
}

type MenuInfo = Readonly<{
    menuTree: MenuTree
    roles: ApiRoles
    menuTarget: MenuTarget
}>
function apiRoles(result: LoadApiCredentialResult) {
    if (result.success && result.found) {
        return result.apiCredential.apiRoles
    }
    return emptyApiRoles()
}

function toMenu(
    { menuTree, menuTarget, roles }: MenuInfo,
    menuExpand: MenuExpand,
    menuBadge: MenuBadge
): Menu {
    const menuExpandSet = new MenuCategoryPathSet()
    menuExpandSet.init(menuExpand)

    return menuTreeToMenu(menuTree, [])

    function menuTreeToMenu(menuTree: MenuTree, categoryPath: MenuCategoryPath): Menu {
        return menuTree.flatMap((node) => menuNodes(node, categoryPath))
    }
    function menuNodes(node: MenuTreeNode, categoryPath: MenuCategoryPath): MenuNode[] {
        switch (node.type) {
            case "category":
                return menuCategory(node.category, node.children, [
                    ...categoryPath,
                    markMenuCategoryLabel(node.category.label),
                ])
            case "item":
                return [menuItem(node.item)]
        }
    }
    function menuCategory(
        category: MenuTreeCategory,
        menuTree: MenuTree,
        path: MenuCategoryPath
    ): MenuNode[] {
        if (!isAllow()) {
            return EMPTY_MENU
        }

        const children = menuTreeToMenu(menuTree, path)
        if (children.length === 0) {
            return EMPTY_MENU
        }

        const sumBadgeCount = children.reduce((acc, node) => acc + node.badgeCount, 0)

        return [
            {
                type: "category",
                isExpand: menuExpandSet.hasEntry(path) || children.some(hasActive),
                badgeCount: sumBadgeCount,
                category: toMenuCategory(category),
                children,
                path,
            },
        ]

        function isAllow(): boolean {
            switch (category.permission.type) {
                case "any":
                    return true
                case "role":
                    return category.permission.roles.some((role) => {
                        return roles.includes(role)
                    })
            }
        }
        function hasActive(node: MenuNode): boolean {
            switch (node.type) {
                case "category":
                    return node.children.some(hasActive)
                case "item":
                    return node.isActive
            }
        }
    }
    function menuItem(item: MenuTreeItem): MenuNode {
        return {
            type: "item",
            isActive: menuTarget.versioned ? item.path === menuTarget.currentPath : false,
            badgeCount: menuBadge[item.path] || 0,
            item: toMenuItem(item, menuTarget.version),
        }
    }
}

function toMenuCategory(category: MenuTreeCategory): MenuCategory {
    return {
        label: markMenuCategoryLabel(category.label),
    }
}
function toMenuItem({ label, icon, path }: MenuTreeItem, version: string): MenuItem {
    return markMenuItem({ label, icon, href: `/${version}${path}` })
}

const toggleMenuExpand: ToggleMenuExpand = (infra) => () => (menu, path, post) => {
    const { menuExpands } = infra

    const updatedMenu = toggleMenu(menu, path)

    const response = menuExpands.store(gatherMenuExpand(updatedMenu, []))
    if (!response.success) {
        post({ type: "failed-to-toggle", menu: updatedMenu, err: response.err })
        return
    }

    post({ type: "succeed-to-toggle", menu: updatedMenu })

    function gatherMenuExpand(target: Menu, path: MenuCategoryPath): MenuExpand {
        const expand: MenuExpand = []
        target.forEach((node) => {
            switch (node.type) {
                case "item":
                    break

                case "category":
                    if (node.isExpand) {
                        gatherCategory(node.category.label, node.children)
                    }
                    break
            }
        })
        return expand

        function gatherCategory(label: MenuCategoryLabel, children: Menu) {
            const currentPath = [...path, label]
            expand.push(currentPath)
            gatherMenuExpand(children, currentPath).forEach((entry) => {
                expand.push(entry)
            })
        }
    }
    function toggleMenu(menu: Menu, path: MenuCategoryPath): Menu {
        if (path.length === 0) {
            return menu
        }
        return menu.map((node) => {
            if (node.type !== "category" || node.category.label !== path[0]) {
                return node
            }
            if (path.length === 1) {
                return { ...node, isExpand: !node.isExpand }
            }
            return {
                ...node,
                children: toggleMenu(node.children, path.slice(1)),
            }
        })
    }
}

const EMPTY_BADGE: MenuBadge = {}
const EMPTY_EXPAND: MenuExpand = []

const EMPTY_BREADCRUMB: Breadcrumb = []
const EMPTY_MENU: MenuNode[] = []
