import { h } from "preact"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"

import { DashboardComponent } from "./dashboard"

import { mockBaseResource } from "../../action_base/mock"

export default {
    title: "main/public/Noshi/Dashboard",
    parameters: {
        layout: "fullscreen",
    },
}

type MockProps = {
    // no props
}
const template = storyTemplate<MockProps>(() => {
    return h(DashboardComponent, mockBaseResource())
})

export const Dashboard = template({})
