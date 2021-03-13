import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../z_vendor/storybook/preact/story"

import {
    appLayout,
    appMain,
    mainHeader,
    mainTitle,
    mainBody,
} from "../../../../z_vendor/getto-css/preact/layout/app"

import { copyright, siteInfo } from "../../../../x_preact/common/site"
import { lniClass, lnir } from "../../../../z_external/icon/line_icon"

import { LoadMenuComponent } from "./load_menu"

import { initMockLoadMenuCoreAction, initMockMenu } from "../core/mock"

import { LoadMenuCoreState } from "../core/action"

import { Menu } from "../../kernel/data"

enum LoadEnum {
    "success",
    "failed-to-fetch-menu",
    "required-to-login",
    "repository-error",
    "bad-request",
    "server-error",
    "bad-response",
    "infra-error",
}

export default {
    title: "library/Outline/LoadMenu",
    parameters: {
        layout: "fullscreen",
    },
    argTypes: {
        load: {
            control: { type: "select", options: enumKeys(LoadEnum) },
        },
    },
}

type MockProps = Readonly<{
    load: keyof typeof LoadEnum
    label: string
    badgeCount: number
    err: string
}>
const template = storyTemplate<MockProps>((props) => {
    return appLayout({
        siteInfo: siteInfo(),
        header: [],
        main: appMain({
            header: mainHeader([mainTitle("タイトル")]),
            body: mainBody("コンテンツ"),
            copyright: copyright(),
        }),
        menu: h(LoadMenuComponent, {
            menu: initMockLoadMenuCoreAction(menu()),
            state: state(),
        }),
    })

    function state(): LoadMenuCoreState {
        switch (props.load) {
            case "success":
                return { type: "succeed-to-load", menu: menu() }

            case "failed-to-fetch-menu":
            case "required-to-login":
                return { type: props.load }

            case "repository-error":
                return {
                    type: "repository-error",
                    err: { type: "infra-error", err: props.err },
                }

            default:
                return {
                    type: "failed-to-update",
                    menu: menu(),
                    err: { type: props.load, err: props.err },
                }
        }
    }

    function menu(): Menu {
        return initMockMenu(props.label, lniClass(lnir("home")), props.badgeCount)
    }
})

export const LoadMenu = template({ load: "success", label: "ホーム", badgeCount: 99, err: "" })
