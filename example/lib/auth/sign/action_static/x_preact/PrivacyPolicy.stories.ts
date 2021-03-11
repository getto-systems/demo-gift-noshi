import { h } from "preact"

import { storyTemplate } from "../../../../z_vendor/storybook/preact/story"

import { PrivacyPolicyComponent } from "./PrivacyPolicy"

import { initSignLinkResource } from "../../common/link/action/impl"

export default {
    title: "main/public/Auth/Sign/PrivacyPolicy",
    parameters: {
        layout: "fullscreen",
    },
}

export type Props = {
    // no props
}
const template = storyTemplate<Props>(() => {
    return h(PrivacyPolicyComponent, initSignLinkResource())
})

export const Box = template({})
