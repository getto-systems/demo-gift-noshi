import {
    setupAsyncActionTestRunner,
    setupSyncActionTestRunner,
} from "../../z_vendor/getto-application/action/test_helper_legacy"

import { markMenuCategoryLabel, standard_MenuTree } from "../kernel/impl/test_helper"

import { convertRepository } from "../../z_vendor/getto-application/infra/repository/helper"
import { mockRemotePod } from "../../z_vendor/getto-application/infra/remote/mock"
import { mockRepository } from "../../z_vendor/getto-application/infra/repository/mock"

import { mockLoadMenuLocationDetecter } from "../kernel/impl/mock"

import { initLoadMenuCoreAction, initLoadMenuCoreMaterial } from "./core/impl"

import { menuExpandRepositoryConverter } from "../kernel/impl/converter"
import { loadMenuEventHasDone } from "../load_menu/impl/core"
import { updateMenuBadgeEventHasDone } from "../update_menu_badge/impl/core"
import { toggleMenuExpandEventHasDone } from "../toggle_menu_expand/impl/core"

import {
    GetMenuBadgeRemotePod,
    MenuExpandRepositoryPod,
    MenuExpandRepositoryValue,
} from "../kernel/infra"

import { LoadMenuResource } from "./resource"
import { LoadMenuCoreState } from "./core/action"

import { LoadMenuLocationDetecter } from "../kernel/method"

describe("Menu", () => {
    test("load menu", () =>
        new Promise<void>((done) => {
            const { resource } = standard()

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.menu.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-load",
                                menu: [
                                    $category("MAIN", ["MAIN"], 0, [
                                        $item("ホーム", "home", "/1.0.0/index.html", 0),
                                        item("ドキュメント", "docs", "/1.0.0/docs/index.html", 0),
                                    ]),
                                    category("DOCUMENT", ["DOCUMENT"], 0, [
                                        item("認証・認可", "auth", "/1.0.0/docs/auth.html", 0),
                                        category("DETAIL", ["DOCUMENT", "DETAIL"], 0, [
                                            item("詳細", "detail", "/1.0.0/docs/auth.html", 0),
                                        ]),
                                    ]),
                                ],
                            },
                            {
                                type: "succeed-to-update",
                                menu: [
                                    $category("MAIN", ["MAIN"], 30, [
                                        $item("ホーム", "home", "/1.0.0/index.html", 10),
                                        item("ドキュメント", "docs", "/1.0.0/docs/index.html", 20),
                                    ]),
                                    category("DOCUMENT", ["DOCUMENT"], 0, [
                                        item("認証・認可", "auth", "/1.0.0/docs/auth.html", 0),
                                        category("DETAIL", ["DOCUMENT", "DETAIL"], 0, [
                                            item("詳細", "detail", "/1.0.0/docs/auth.html", 0),
                                        ]),
                                    ]),
                                ],
                            },
                        ])
                    },
                },
            ])

            resource.menu.subscriber.subscribe(runner(done))
        }))

    test("load menu; saved expands", () =>
        new Promise<void>((done) => {
            const { resource } = expand()

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.menu.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-load",
                                menu: [
                                    $category("MAIN", ["MAIN"], 0, [
                                        $item("ホーム", "home", "/1.0.0/index.html", 0),
                                        item("ドキュメント", "docs", "/1.0.0/docs/index.html", 0),
                                    ]),
                                    $category("DOCUMENT", ["DOCUMENT"], 0, [
                                        item("認証・認可", "auth", "/1.0.0/docs/auth.html", 0),
                                        category("DETAIL", ["DOCUMENT", "DETAIL"], 0, [
                                            item("詳細", "detail", "/1.0.0/docs/auth.html", 0),
                                        ]),
                                    ]),
                                ],
                            },
                            {
                                type: "succeed-to-update",
                                menu: [
                                    $category("MAIN", ["MAIN"], 30, [
                                        $item("ホーム", "home", "/1.0.0/index.html", 10),
                                        item("ドキュメント", "docs", "/1.0.0/docs/index.html", 20),
                                    ]),
                                    $category("DOCUMENT", ["DOCUMENT"], 0, [
                                        item("認証・認可", "auth", "/1.0.0/docs/auth.html", 0),
                                        category("DETAIL", ["DOCUMENT", "DETAIL"], 0, [
                                            item("詳細", "detail", "/1.0.0/docs/auth.html", 0),
                                        ]),
                                    ]),
                                ],
                            },
                        ])
                    },
                },
            ])

            resource.menu.subscriber.subscribe(runner(done))
        }))

    test("load menu; toggle expands", () =>
        new Promise<void>((done) => {
            const { resource, repository } = standard()
            const menuExpand = repository.menuExpand(menuExpandRepositoryConverter)

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.menu.ignite()
                    },
                    examine: () => {
                        // load のテストは他でやる
                    },
                },
                {
                    statement: () => {
                        resource.menu.show([markMenuCategoryLabel("DOCUMENT")])
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-toggle",
                                menu: [
                                    $category("MAIN", ["MAIN"], 30, [
                                        $item("ホーム", "home", "/1.0.0/index.html", 10),
                                        item("ドキュメント", "docs", "/1.0.0/docs/index.html", 20),
                                    ]),
                                    $category("DOCUMENT", ["DOCUMENT"], 0, [
                                        item("認証・認可", "auth", "/1.0.0/docs/auth.html", 0),
                                        category("DETAIL", ["DOCUMENT", "DETAIL"], 0, [
                                            item("詳細", "detail", "/1.0.0/docs/auth.html", 0),
                                        ]),
                                    ]),
                                ],
                            },
                        ])
                    },
                },
                {
                    statement: () => {
                        resource.menu.show([
                            markMenuCategoryLabel("DOCUMENT"),
                            markMenuCategoryLabel("DETAIL"),
                        ])
                    },
                    examine: async (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-toggle",
                                menu: [
                                    $category("MAIN", ["MAIN"], 30, [
                                        $item("ホーム", "home", "/1.0.0/index.html", 10),
                                        item("ドキュメント", "docs", "/1.0.0/docs/index.html", 20),
                                    ]),
                                    $category("DOCUMENT", ["DOCUMENT"], 0, [
                                        item("認証・認可", "auth", "/1.0.0/docs/auth.html", 0),
                                        $category("DETAIL", ["DOCUMENT", "DETAIL"], 0, [
                                            item("詳細", "detail", "/1.0.0/docs/auth.html", 0),
                                        ]),
                                    ]),
                                ],
                            },
                        ])

                        const result = await menuExpand.get()
                        if (!result.success) {
                            throw new Error("menu expand get failed")
                        }
                        if (!result.found) {
                            throw new Error("menu expand not found")
                        }
                        expect(result.value.values).toEqual([["DOCUMENT"], ["DOCUMENT", "DETAIL"]])
                    },
                },
                {
                    statement: () => {
                        resource.menu.hide([
                            markMenuCategoryLabel("DOCUMENT"),
                            markMenuCategoryLabel("DETAIL"),
                        ])
                    },
                    examine: async (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-toggle",
                                menu: [
                                    $category("MAIN", ["MAIN"], 30, [
                                        $item("ホーム", "home", "/1.0.0/index.html", 10),
                                        item("ドキュメント", "docs", "/1.0.0/docs/index.html", 20),
                                    ]),
                                    $category("DOCUMENT", ["DOCUMENT"], 0, [
                                        item("認証・認可", "auth", "/1.0.0/docs/auth.html", 0),
                                        category("DETAIL", ["DOCUMENT", "DETAIL"], 0, [
                                            item("詳細", "detail", "/1.0.0/docs/auth.html", 0),
                                        ]),
                                    ]),
                                ],
                            },
                        ])

                        const result = await menuExpand.get()
                        if (!result.success) {
                            throw new Error("menu expand get failed")
                        }
                        if (!result.found) {
                            throw new Error("menu expand not found")
                        }
                        expect(result.value.values).toEqual([["DOCUMENT"]])
                    },
                },
            ])

            resource.menu.subscriber.subscribe(runner(done))
        }))

    test("terminate", () =>
        new Promise<void>((done) => {
            const { resource } = standard()

            const runner = setupSyncActionTestRunner([
                {
                    statement: (check) => {
                        resource.menu.terminate()
                        resource.menu.ignite()

                        setTimeout(check, 256) // wait for event...
                    },
                    examine: (stack) => {
                        // no input/validate event after terminate
                        expect(stack).toEqual([])
                    },
                },
            ])

            resource.menu.subscriber.subscribe(runner(done))
        }))

    type MenuNode =
        | Readonly<{
              type: "category"
              category: Readonly<{ label: string }>
              path: string[]
              isExpand: boolean
              badgeCount: number
              children: MenuNode[]
          }>
        | Readonly<{
              type: "item"
              item: Readonly<{ label: string; icon: string; href: string }>
              isActive: boolean
              badgeCount: number
          }>

    function category(label: string, path: string[], badgeCount: number, children: MenuNode[]) {
        return categoryNode(label, path, false, badgeCount, children)
    }
    function $category(label: string, path: string[], badgeCount: number, children: MenuNode[]) {
        return categoryNode(label, path, true, badgeCount, children)
    }
    function categoryNode(
        label: string,
        path: string[],
        isExpand: boolean,
        badgeCount: number,
        children: MenuNode[],
    ): MenuNode {
        return {
            type: "category",
            category: { label },
            path,
            isExpand,
            badgeCount,
            children,
        }
    }

    function item(label: string, icon: string, href: string, badgeCount: number) {
        return itemNode(label, icon, href, false, badgeCount)
    }
    function $item(label: string, icon: string, href: string, badgeCount: number) {
        return itemNode(label, icon, href, true, badgeCount)
    }
    function itemNode(
        label: string,
        icon: string,
        href: string,
        isActive: boolean,
        badgeCount: number,
    ): MenuNode {
        return {
            type: "item",
            item: { label, icon, href },
            isActive,
            badgeCount,
        }
    }
})

function standard() {
    const [resource, menuExpand] = initResource(empty_menuExpand())

    return { resource, repository: { menuExpand } }
}
function expand() {
    const [resource] = initResource(expand_menuExpand())

    return { resource }
}

function initResource(
    menuExpand: MenuExpandRepositoryPod,
): [LoadMenuResource, MenuExpandRepositoryPod] {
    const version = standard_version()
    const detecter = standard_detecter()
    const getMenuBadge = standard_getMenuBadge()

    return [
        {
            menu: initLoadMenuCoreAction(
                initLoadMenuCoreMaterial(
                    {
                        version,
                        menuTree: standard_MenuTree(),
                        menuExpand,
                        getMenuBadge,
                    },
                    detecter,
                ),
            ),
        },
        menuExpand,
    ]
}

function standard_detecter(): LoadMenuLocationDetecter {
    return mockLoadMenuLocationDetecter(
        new URL("https://example.com/1.0.0/index.html"),
        standard_version(),
    )
}
function standard_version(): string {
    return "1.0.0"
}

function empty_menuExpand(): MenuExpandRepositoryPod {
    return convertRepository(mockRepository<MenuExpandRepositoryValue>())
}
function expand_menuExpand(): MenuExpandRepositoryPod {
    const menuExpand = mockRepository<MenuExpandRepositoryValue>()
    menuExpand.set([[markMenuCategoryLabel("DOCUMENT")]])
    return convertRepository(menuExpand)
}

function standard_getMenuBadge(): GetMenuBadgeRemotePod {
    return mockRemotePod(
        () => ({
            success: true,
            value: [
                { path: "/index.html", count: 10 },
                { path: "/docs/index.html", count: 20 },
            ],
        }),
        { wait_millisecond: 0 },
    )
}

function actionHasDone(state: LoadMenuCoreState): boolean {
    switch (state.type) {
        case "initial-menu":
            return false

        case "succeed-to-load":
        case "required-to-login":
        case "repository-error":
            // カバレッジのため、loadMenuEventHasDone はコールしたい
            // が、succeed-to-load では hasDone しない
            return loadMenuEventHasDone(state) && state.type !== "succeed-to-load"

        case "succeed-to-update":
        case "failed-to-update":
            return updateMenuBadgeEventHasDone(state)

        case "succeed-to-toggle":
            return toggleMenuExpandEventHasDone(state)
    }
}
