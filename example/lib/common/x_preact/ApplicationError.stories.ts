import { h } from "preact"
import { storyTemplate } from "../../z_vendor/storybook/preact/story"

import { ApplicationErrorComponent } from "./ApplicationError"

export default {
    title: "library/Common/ApplicationError",
    parameters: {
        layout: "fullscreen",
    },
}

type MockProps = Readonly<{
    err: string
}>
const template = storyTemplate<MockProps>((args) => {
    return h(ApplicationErrorComponent, args)
})

export const ApplicationError = template({ err: "application error" })
