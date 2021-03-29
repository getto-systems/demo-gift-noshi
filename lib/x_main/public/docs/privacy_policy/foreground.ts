import { render, h } from "preact"

import { newDocsView } from "../../../../docs/action_docs/init"

import { docs_privacyPolicy } from "../../../../noshi/docs"

import { DocsEntry } from "../../../../docs/action_docs/x_preact/docs"

render(
    h(DocsEntry, {
        view: newDocsView({
            webStorage: localStorage,
            currentLocation: location,
        }),
        docs: {
            title: "プライバシーポリシー",
            contents: [[docs_privacyPolicy]],
        },
    }),
    document.body,
)
