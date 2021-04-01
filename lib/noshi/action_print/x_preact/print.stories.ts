import { h } from "preact"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { mockPrintResource } from "../mock"

import { PrintComponent } from "./print"

export default {
    title: "main/public/Noshi/Print",
    parameters: {
        layout: "fullscreen",
    },
}

type MockProps = {
    // no props
}
const template = storyTemplate<MockProps>(() => {
    return h(PrintComponent, mockPrintResource(new URL("https://example.com/print.html")))
})

export const Dashboard = template({})
