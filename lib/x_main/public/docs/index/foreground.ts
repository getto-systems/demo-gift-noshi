import { render, h } from "preact"

import { foregroundOutsideFeature } from "../../../x_outside_feature/common"

import { newDocsView } from "../../../../docs/action_docs/init"

import { docs_noshi, docs_noshi_details } from "../../../../noshi/docs"

import { DocsEntry } from "../../../../docs/action_docs/x_preact/docs"

render(
    h(DocsEntry, {
        view: newDocsView(foregroundOutsideFeature()),
        docs: {
            title: "ドキュメント",
            contents: [[docs_noshi], [docs_noshi_details]],
        },
    }),
    document.body,
)
