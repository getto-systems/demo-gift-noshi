import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../z_vendor/storybook/preact/story"

import { LoadSeasonFieldComponent } from "./load_season_field"

import { markSeason } from "../../load_season/impl/test_helper"

import { mockLoadSeasonResource } from "../mock"

import { LoadSeasonCoreState } from "../core/action"

enum LoadEnum {
    "success",
    "error",
}

enum SeasonPeriodEnum {
    "summer",
    "winter",
}

export default {
    title: "library/Example/Common/Example",
    argTypes: {
        load: {
            control: { type: "select", options: enumKeys(LoadEnum) },
        },
        period: {
            control: { type: "select", options: enumKeys(SeasonPeriodEnum) },
        },
    },
}

type MockProps = Readonly<{
    load: keyof typeof LoadEnum
    year: number
    period: keyof typeof SeasonPeriodEnum
    err: string
}>
const template = storyTemplate<MockProps>((props) => {
    return h(LoadSeasonFieldComponent, { ...mockLoadSeasonResource(), state: state() })

    function state(): LoadSeasonCoreState {
        switch (props.load) {
            case "success":
                return {
                    type: "succeed-to-load",
                    value: markSeason({ year: props.year, period: props.period }),
                }

            case "error":
                return { type: "failed-to-load", err: { type: "infra-error", err: props.err } }
        }
    }
})

export const Example = template({
    load: "success",
    year: new Date().getFullYear(),
    period: "summer",
    err: "",
})
