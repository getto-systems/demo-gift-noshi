import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../z_vendor/storybook/preact/story"

import { copyright, siteInfo } from "../../../site"
import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../../z_vendor/getto-css/preact/layout/app"

import { LoadMenuEntry } from "../../../../outline/action_load_menu/x_preact/load_menu"
import { LoadSeasonComponent } from "./load_season"

import { markSeason } from "../../load_season/impl/test_helper"

import { mockLoadMenuResource } from "../../../../outline/action_load_menu/mock"
import { mockLoadSeasonCoreAction } from "../core/mock"

import { LoadSeasonResult } from "../../load_season/data"

enum LoadEnum {
    "success",
    "error",
}

export default {
    title: "library/Example/Common/Load Season",
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
    year: number
    err: string
}>
const template = storyTemplate<MockProps>((props) => {
    return appLayout({
        siteInfo: siteInfo(),
        header: [h(LoadSeasonComponent, { season: mockLoadSeasonCoreAction(season()) })],
        main: appMain({
            header: mainHeader([mainTitle("タイトル")]),
            body: mainBody("コンテンツ"),
            copyright: copyright(),
        }),
        menu: h(LoadMenuEntry, mockLoadMenuResource()),
    })

    function season(): LoadSeasonResult {
        switch (props.load) {
            case "success":
                return { success: true, value: markSeason({ year: props.year }) }

            case "error":
                return { success: false, err: { type: "infra-error", err: props.err } }
        }
    }
})

export const LoadSeason = template({ load: "success", year: new Date().getFullYear(), err: "" })
