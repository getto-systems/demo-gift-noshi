import {
    docsExplanation,
    docsModule,
    docsNegativeNote,
    docsPurpose,
    docsSection,
    docsSection_double,
} from "../../z_vendor/getto-application/docs/helper"

import { DocsSection } from "../../z_vendor/getto-application/docs/data"

export const docs_auth_sign: DocsSection[] = [
    docsSection("認証", [
        docsPurpose(["業務で必要な時に使用できる", "業務内容をプライベートに保つ"]),
        docsModule([
            "アクセスチケット更新",
            "ログアウト",
            "パスワードログイン",
            "パスワードリセット",
            "web 証明書ログイン",
        ]),
    ]),
]

export const docs_auth_sign_explanation: DocsSection[] = [
    docsSection("想定するサーバー・クライアント", [
        docsExplanation(["content-server", "api-server", "http-client", "text-client"]),
    ]),
]

export const docs_auth_sign_negativeNote: DocsSection[] = [
    docsSection_double("判明しているダメな点", [
        docsNegativeNote([
            {
                message: "チケットの有効期限切れの前にチケットを無効化できない",
                help: "最大延長期間を操作することで再認証を促すことは可能",
            },
            {
                message: "チケットが漏れた場合、有効期限延長を続けることで最大期間アクセス可能",
                help: "これをするためには cookie の奪取とメモリの解析を行う必要があるので、事実上不可能",
            },
            {
                message: "http を使用することを想定",
                help: "http 以外の方式で通信する必要が出たときに考える",
            },
            {
                message: "cookie を使用するため別なタブで別ユーザーとしてログインできない",
                help: "別ユーザーでログインする必要がある設計にしない",
            },
        ]),
    ]),
]
