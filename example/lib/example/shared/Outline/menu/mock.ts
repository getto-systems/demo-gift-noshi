import { lnir, iconClass } from "../../../../z_external/icon"
import { MockComponent } from "../../../../z_external/mock/component"

import { MenuComponent, MenuState } from "./component"

import { markMenuCategory, markMenuItem, Menu } from "../../menu/data"

export function initMenu(state: MenuState): MenuMockComponent {
    return new MenuMockComponent(state)
}

export type MenuMockProps =
    | Readonly<{ type: "success"; badgeCount: number }>
    | Readonly<{ type: "empty-nonce" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function mapMenuMockProps(props: MenuMockProps): MenuState {
    switch (props.type) {
        case "success":
            return { type: "succeed-to-load", menu: menu(props.badgeCount) }

        default:
            return { type: "failed-to-load", menu: menu(0), err: props }
    }

    function menu(badgeCount: number): Menu {
        return [
            {
                type: "category",
                isExpand: true,
                badgeCount,
                category: markMenuCategory({ label: "MAIN" }),
                children: [
                    {
                        type: "item",
                        isActive: true,
                        badgeCount,
                        item: markMenuItem({
                            label: "ホーム",
                            icon: iconClass(lnir("home")),
                            href: "/dist/index.html",
                        }),
                    },
                ],
            },
        ]
    }
}

class MenuMockComponent extends MockComponent<MenuState> implements MenuComponent {
    load() {
        // mock では特に何もしない
    }
    toggle() {
        // mock では特に何もしない
    }
}
