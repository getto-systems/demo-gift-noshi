import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"

import { noPadded } from "../../z_storybook/display"

import { EntryPoint } from "./NotFound"

import { initMockPropsPasser } from "../../../common/vendor/getto-example/Application/mock"
import { newMockNotFound } from "../../../availability/z_EntryPoint/NotFound/mock"
import { CurrentVersionMockProps } from "../../../availability/x_Resource/GetCurrentVersion/currentVersion/mock"

export default {
    title: "Auth/NotFound",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = {
    // no props
}
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<CurrentVersionMockProps>()
    const entryPoint = newMockNotFound(passer)
    return h(Preview, { args })

    function Preview(_: { args: MockProps }) {
        useEffect(() => {
            passer.update({ type: "success" })
        })
        return noPadded(h(EntryPoint, entryPoint))
    }
}

interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Initial = Template.bind({})
Initial.args = {}
