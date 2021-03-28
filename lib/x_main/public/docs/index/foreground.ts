import { render, h } from "preact"

import { newDocsView } from "../../../../docs/action_docs/init"

import { docs_example } from "../../../../example/docs"

import { DocsEntry } from "../../../../docs/action_docs/x_preact/docs"

render(
    h(DocsEntry, {
        view: newDocsView({
            webStorage: localStorage,
            currentLocation: location,
        }),
        docs: {
            title: "ドキュメント",
            contents: [[docs_example]],
        },
    }),
    document.body,
)
