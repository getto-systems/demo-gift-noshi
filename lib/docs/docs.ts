import { docsItem, docsPurpose, docsSection } from "../z_vendor/getto-application/docs/helper"

import { DocsSection } from "../z_vendor/getto-application/docs/data"

export const docs_docs: DocsSection[] = [
    docsSection("ドキュメント", [
        docsPurpose(["業務の目標を達成する"]),
        docsItem("重要な点の明文化", [
            "重要な点が判別できる",
            "重要でない点が判別できる",
            "すべての関係者が読める",
            "書きやすい",
        ]),
    ]),
]
