import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../z_storybook/story"
import { noPaddedStory } from "../../z_storybook/display"

import { EntryPoint } from "./EntryPoint"

import { initMockPropsPasser } from "../../../common/vendor/getto-example/Application/mock"

import {
    LoginErrorMockProps,
    initMockLoginEntryPointAsError,
} from "../../../auth/z_EntryPoint/Sign/mock"

export default {
    title: "Auth/Sign/Error",
}

type MockProps = LoginErrorMockProps
const template = storyTemplate<MockProps>((args) => {
    const passer = initMockPropsPasser<LoginErrorMockProps>()
    const entryPoint = initMockLoginEntryPointAsError(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }): VNode {
        useEffect(() => {
            passer.update(props.args)
        })
        return noPaddedStory(h(EntryPoint, entryPoint))
    }
})

export const Error = template({ error: "error" })
