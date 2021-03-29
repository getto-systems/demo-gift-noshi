import {
    docsDescription,
    docsModule,
    docsPurpose,
    docsSection,
    docsSection_double,
} from "../z_vendor/getto-application/docs/helper"

import { DocsSection } from "../z_vendor/getto-application/docs/data"

export const docs_noshi: DocsSection[] = [
    docsSection("のし印刷", [docsPurpose(["のしを適切に印刷する"])]),
]

export const docs_noshi_details: DocsSection[] = [
    docsSection("のし印刷", [
        docsModule(["伝票データの取り込み", "のしデータをもとに印刷プレビュー", "印刷"]),
    ]),
    docsSection("のしデータ", [
        docsDescription([
            {
                title: "のし種別",
                body: [
                    "のし区分 : 御歳暮 / 内祝 / etc.",
                    "のしサイズ : B4 / A4 / etc.",
                ],
                help: ["商品データから取得"],
            },
            {
                title: "名入れ",
                body: ["記載する名前"],
                help: ["伝票データから取得"],
            },
        ]),
    ]),
]

export const docs_privacyPolicy: DocsSection[] = [
    docsSection_double("取り扱いデータ", [
        docsDescription([
            {
                title: "のしデータ",
                body: [
                    "のしを印刷するために使用します",
                    "それ以外の用途で使用することはありません",
                    "また、業務に関係ない対象に情報が開示されることはありません",
                    "プレビュー版では、データの保存は行われません",
                ],
                help: [],
            },
        ]),
    ]),
]
