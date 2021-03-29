import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../z_vendor/storybook/preact/story"

import { ExampleComponent } from "./example"

import { markSeason } from "../../load_season/impl/test_helper"

import { mockLoadSeasonCoreAction } from "../core/mock"

import { LoadSeasonResult } from "../../load_season/data"

enum LoadEnum {
    "success",
    "error",
}

export default {
    title: "library/Example/Common/Example",
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
    return h(ExampleComponent, { season: mockLoadSeasonCoreAction(season()) })

    function season(): LoadSeasonResult {
        switch (props.load) {
            case "success":
                return { success: true, value: markSeason({ year: props.year }) }

            case "error":
                return { success: false, err: { type: "infra-error", err: props.err } }
        }
    }
})

export const Example = template({ load: "success", year: new Date().getFullYear(), err: "" })
