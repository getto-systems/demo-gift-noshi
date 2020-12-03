import { VNode } from "preact"
import { html } from "htm/preact"

import { container, VNodeContent, v_medium, v_small } from "../../../../../layout"
import {
    box,
    box_double,
    form,
    iconSection,
    items,
    itemsSection,
    negativeNote,
    pending,
    validate,
} from "../../../box"
import { content_auth_login } from "../../auth"

export const content_development_auth_login = (): VNode[] => [
    container([
        content_auth_login(),
        box("業務で必要な時に使用するために", [
            html`
                <p>有効期限付きのトークンを発行する</p>
                <p>有効期限が切れるまでは使用できる</p>
                <p>有効期限を延長できる</p>
            `,
            v_small(),
            itemsSection(pending("ユーザー情報を管理できる"), [
                "ログインID 変更",
                "パスワード変更",
                "web 証明書変更",
            ]),
        ]),
        box("業務内容をプライベートに保つために", [
            html`
                <p>トークンは署名して送信</p>
                <p>トークンはセキュアな方法で送信</p>
                <p>コンテンツのアクセス制限</p>
            `,
            v_small(),
            itemsSection(pending("ユーザーの状態を管理できる"), [
                "ログイン可否の変更",
                "アクセスを許可するコンテンツ",
            ]),
        ]),
    ]),
    container(general()),
    v_medium(),
    container(renewCredential()),
    v_medium(),
    // TODO ログアウトは認証情報管理に移動
    container(logout()),
    v_medium(),
    container(passwordLogin()),
    v_small(),
    container(passwordReset()),
    v_medium(),
    container(webAuthn()),
    // TODO ここから下を auth/detail に移動
    v_medium(),
    container(detail()),
    v_medium(),
    container(detail_renew()),
    v_medium(),
    container(detail_password()),
]

function general(): VNode[] {
    return [
        box_double("判明しているダメな点", [
            negativeNote(
                "チケットの有効期限切れの前にチケットを無効化できない",
                "（最大延長期間を操作することで再認証を促すことは可能）"
            ),
            negativeNote(
                "チケットが漏れた場合、有効期限延長を続けることで最大期間アクセス可能",
                "（これをするためには cookie の奪取とメモリの解析を行う必要があるので、事実上不可能としていいかな）"
            ),
            negativeNote(
                "http を使用することを想定",
                "（http 以外の方式で通信する必要が出たときに考える）"
            ),
            negativeNote(
                "cookie を使用するため別なタブで別ユーザーとしてログインできない",
                "（アプリケーションを別ユーザーでログインする必要がある設計にしないことで対応）"
            ),
        ]),
        box("前提とするサーバー・クライアント", [
            iconSection("lnir lnir-database", "コンテンツサーバー", "（CDN : CloudFront など）"),
            iconSection("lnir lnir-cogs", "API サーバー", "（アプリケーションサーバー）"),
            iconSection("lnir lnir-display", "http クライアント", "（ブラウザ、スマホアプリ）"),
            iconSection("lnir lnir-envelope", "テキストメッセージクライアント", "（メール、slack）"),
        ]),
    ]
}

const renewCredential = () => [
    box("認証トークンの更新", [
        itemsSection("インスタントロード", ["有効期限内ならすぐにロード"]),
        itemsSection("認証トークン更新", ["認証トークンの有効期限を延長"]),
        itemsSection("継続更新", ["一定期間ごとに認証トークン更新"]),
    ]),
    box("インスタントロード", [
        toContentServer("認証トークン", ["cookie"]),
        inContentServer("スクリプトをロード", ["認証トークンが有効な場合"]),
        hr,
        html`<p>認証トークンが有効期限切れの場合は認証トークン更新の後ロードを試みる</p>`,
    ]),
    box("認証トークン更新", [
        toApiServer("チケットトークン", ["cookie + nonce"]),
        inApiServer(
            items([
                validate("チケットトークン検証"),
                validate("チケット有効期限検証"),
                "チケット有効期限延長",
                "チケットトークン発行",
                "API トークン発行",
                "コンテンツトークン発行",
            ]),
            []
        ),
        fromApiServer("認証トークン", ["チケットトークン", "API トークン / 権限", "コンテンツトークン"]),
        hr,
        itemsSection("認証トークンを失効させる検証", ["チケットトークン検証", "チケット有効期限検証"]),
    ]),
    box("継続更新", [html`<p>処理は認証トークン更新と同様</p>`, html`<p>一定期間ごとに更新を行う</p>`]),
]
const logout = () => [
    box("ログアウト", [
        toApiServer("チケットトークン", ["cookie + nonce"]),
        inApiServer(
            items([
                validate("チケットトークン検証"),
                validate("チケット有効期限検証"),
                "チケット有効期限無効化",
            ]),
            []
        ),
        hr,
        html`<p>ログアウトで認証情報は失効</p>`,
        v_medium(),
        itemsSection("認証トークンを失効させる検証", ["チケットトークン検証", "チケット有効期限検証"]),
    ]),
]
const passwordLogin = () => [
    box("パスワードログイン", [
        itemsSection("ログインID・パスワード入力", ["入力形式を検証"]),
        itemsSection("認証リクエスト", ["認証トークンを要求"]),
    ]),
    box("ログインID・パスワード入力", [
        inBrowser(items([validate("ログインID 検証"), validate("パスワード検証")]), []),
        hr,
        html`<p>検証失敗なら認証リクエストできない</p>`,
        v_medium(),
        itemsSection("ログインID 検証", [
            "空でないこと",
            // TODO 長すぎないことをチェックしたほうがいい
        ]),
        itemsSection("パスワード検証", ["空でないこと", "長すぎないこと"]),
    ]),
    box("認証リクエスト", [
        toApiServer(items(["ログインiD", "パスワード"]), []),
        inApiServer(
            items([
                validate("パスワード検証"),
                "チケットトークン発行",
                "API トークン発行",
                "コンテンツトークン発行",
            ]),
            []
        ),
        fromApiServer("認証トークン", ["チケットトークン", "API トークン / 権限", "コンテンツトークン"]),
        hr,
        // TODO ログインID が長すぎないことをチェックしたほうがいい
        itemsSection("パスワード検証", [
            "空でないこと",
            "長すぎないこと",
            "登録されたユーザーのパスワードと一致すること",
        ]),
    ]),
]
const passwordReset = () => [
    box("パスワードリセット", [
        itemsSection("ログインID 入力", ["入力形式を検証"]),
        itemsSection("リセットセッションの開始", ["リセットトークンの要求"]),
        itemsSection("リセットトークン送信状態の確認", ["送信待ち", "送信完了", "送信エラー", "宛先"]),
        itemsSection("ログインID・パスワード入力", ["リセットトークン取得", "入力形式を検証"]),
        itemsSection("パスワードリセット", ["パスワードリセットの要求", "認証トークンの要求"]),
    ]),
    box("ログインID 入力", [
        inBrowser(items([validate("ログインID 検証")]), []),
        hr,
        html`<p>検証失敗ならリセットセッションを開始できない</p>`,
        v_medium(),
        itemsSection("ログインID 検証", [
            "空でないこと",
            // TODO 長すぎないことをチェックしたほうがいい
        ]),
    ]),
    box("リセットセッションの開始", [
        toApiServer(items(["ログインiD"]), []),
        inApiServer(
            items([
                validate("ログインID 検証"),
                "チケットトークン発行",
                "API トークン発行",
                "コンテンツトークン発行",
            ]),
            []
        ),
        fromApiServer("リセットセッションID", []),
        toTextMessage("リセットトークン", []),
        hr,
        itemsSection("ログインID 検証", [
            // TODO 長すぎないことをチェックしたほうがいい
            "リセットトークンの宛先が登録されていること",
        ]),
    ]),
    box("リセットトークン送信状態の確認", [
        toApiServer(items(["リセットセッションID"]), []),
        inApiServer(items([validate("リセットセッションID 検証"), "リセットステータス取得"]), []),
        fromApiServer("リセットステータス", ["リセットトークン送信状態"]),
        hr,
        itemsSection("リセットセッションID 検証", [
            "セッションが開始されていること",
            "セッションが完了していないこと",
        ]),
    ]),
    box("ログインID・パスワード入力", [
        inBrowser(items([validate("ログインID 検証"), validate("パスワード検証")]), []),
        hr,
        html`<p>テキストメッセージクライアントからリセットトークンを取得</p>`,
        html`<p>検証失敗ならパスワードリセットできない</p>`,
        v_medium(),
        itemsSection("ログインID 検証", [
            "空でないこと",
            // TODO 長すぎないことをチェックしたほうがいい
        ]),
        itemsSection("パスワード検証", ["空でないこと", "長すぎないこと"]),
    ]),
    box("パスワードリセット", [
        toApiServer(items(["リセットトークン", "ログインID", "パスワード"]), []),
        inApiServer(
            items([
                validate("リセットトークン検証"),
                validate("ログインID 検証"),
                validate("パスワード検証"),
                "パスワードリセット",
                "チケットトークン発行",
                "API トークン発行",
                "コンテンツトークン発行",
            ]),
            []
        ),
        fromApiServer("認証トークン", ["チケットトークン", "API トークン / 権限", "コンテンツトークン"]),
        hr,
        html`
            <p>旧パスワードは使用できなくなる</p>
            <p>リセット完了でセッションは失効</p>
        `,
        v_medium(),
        itemsSection("リセットトークン検証", [
            "セッションが開始されていること",
            "セッションが完了していないこと",
        ]),
        itemsSection("ログインID 検証", [
            // TODO 長すぎないことをチェックしたほうがいい
            "セッションを開始したときに入力したものと同じであること",
        ]),
        itemsSection("パスワード検証", [
            "空でないこと",
            "長すぎないこと",
        ]),
    ]),
]
function passwordLogin_old() {
    return html`
        ${box(
            // TODO 認証情報管理の項目に移動
            "パスワード変更",
            html` <dl class="form">
                    <dt class="form__header">
                        <i class="lnir lnir-display"></i> ブラウザ
                        <i class="lnir lnir-arrow-right"></i>
                        <i class="lnir lnir-cog"></i> システム
                    </dt>
                    <dd class="form__field">
                        <ul>
                            <li>チケットトークン</li>
                        </ul>
                    </dd>
                </dl>
                <dl class="form">
                    <dt class="form__header"><i class="lnir lnir-cog"></i> システム</dt>
                    <dd class="form__field">
                        <ul>
                            <li>
                                チケットトークン検証
                                <span class="label label_alert">検証失敗</span>
                            </li>
                            <li>
                                チケット有効期限検証
                                <span class="label label_alert">検証失敗</span>
                            </li>
                        </ul>
                    </dd>
                </dl>
                <dl class="form">
                    <dt class="form__header">
                        <i class="lnir lnir-display"></i> ブラウザ
                        <i class="lnir lnir-arrow-left"></i>
                        <i class="lnir lnir-cog"></i> システム
                    </dt>
                    <dd class="form__field">
                        <ul>
                            <li>ログインID</li>
                            <small><li>（パスワードを変更しようとしているログインID を表示）</li></small>
                        </ul>
                    </dd>
                </dl>

                <hr />

                <dl class="form">
                    <dt class="form__header">
                        <i class="lnir lnir-display"></i> ブラウザ
                        <i class="lnir lnir-arrow-right"></i>
                        <i class="lnir lnir-cog"></i> システム
                    </dt>
                    <dd class="form__field">
                        <ul>
                            <li>チケット</li>
                            <li>ログインID</li>
                            <li>旧パスワード</li>
                            <li>新パスワード</li>
                        </ul>
                    </dd>
                </dl>
                <dl class="form">
                    <dt class="form__header"><i class="lnir lnir-cog"></i> システム</dt>
                    <dd class="form__field">
                        <ul>
                            <li>
                                チケットトークン検証
                                <span class="label label_alert">検証失敗</span>
                            </li>
                            <li>
                                チケット有効期限検証
                                <span class="label label_alert">検証失敗</span>
                            </li>
                            <li>旧パスワード検証 <span class="label label_alert">検証失敗</span></li>
                            <li>パスワード変更 <span class="label label_alert">変更失敗</span></li>
                        </ul>
                    </dd>
                </dl>

                <hr />

                <p>チケットトークン・有効期限の検証失敗で認証情報は失効</p>
                <p>旧パスワードは使用できなくなる</p>
                <p>空のパスワードには変更できない</p>
                <p>長すぎるパスワードには変更できない</p>`
        )}
    `
}
function webAuthn() {
    return html`
        ${box(
            pending("web 証明書認証"),
            html` <p>web 証明書の検証</p>
                <p>チケットを新規発行</p>
                <p>API トークンを発行</p>
                <p>コンテンツトークンを発行</p>`
        )}
        ${box(
            pending("web 証明書登録"),
            html` <p>チケットの検証</p>
                <p>パスワードの検証</p>
                <p>新 web 証明書の登録</p>
                <small><p>以前の証明書は使用できなくなる</p></small>`
        )}
    `
}
function manageUser() {
    // TODO ユーザー管理に移動
    return html`
        ${box(
            "ユーザー登録(あとで)",
            html` <p>チケットの検証</p>
                <p>管理者権限を確認</p>
                <p>ユーザーの登録</p>`
        )}
        ${box(
            "特定ユーザーログインID 変更(あとで)管理者",
            html` <p>チケットの検証</p>
                <p>管理者権限を確認</p>
                <p>特定ユーザーのログインIDを変更</p>`
        )}
        ${box(
            "特定ユーザーパスワード変更(あとで)管理者",
            html` <p>チケットの検証</p>
                <p>管理者権限を確認</p>
                <p>特定ユーザーのパスワードを変更</p>`
        )}
        ${box(
            "特定ユーザーパスワード削除(あとで)管理者",
            html` <p>チケットの検証</p>
                <p>管理者権限を確認</p>
                <p>特定ユーザーのパスワードを削除</p>`
        )}
        ${box(
            "特定ユーザー無効化(あとで)管理者",
            html` <p>チケットの検証</p>
                <p>管理者権限を確認</p>
                <p>特定ユーザーの全チケットの最大延長期間を削除</p>`
        )}
    `
}
function detail() {
    return html`
        ${box_double(
            "認証情報",
            html` <dl class="form">
                    <dt class="form__header">ACTION</dt>
                    <dd class="form__field">
                        <ul>
                            <li>チケットトークン検証</li>
                            <li>チケットトークン発行</li>
                            <li>APIトークン発行</li>
                            <li>コンテンツトークン発行</li>
                        </ul>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">チケットトークン</dt>
                    <dd class="form__field">
                        <p>API トークン・コンテンツトークンの有効期限延長に使用するチケット</p>
                        <p>適切な方法で署名する</p>
                        <p>適切な方法で署名を検証する</p>
                        <p>チケットトークンの有効期限は1週間程度とする</p>
                        <small
                            ><p>
                                (金曜に業務終了してから月曜に使用開始するときに有効期限が切れないように）
                            </p></small
                        >
                        <p>チケットトークンをクライアントに送信する際は特にセキュアな方法を使用する</p>
                        <small><p>(secure, http only な cookie を想定）</p></small>

                        <div class="vertical vertical_small"></div>

                        <p>トークンには以下のデータを含める</p>
                        <ul>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small> Nonce
                            </li>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small> ユーザー
                            </li>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small> 有効期限
                            </li>
                        </ul>

                        <div class="vertical vertical_small"></div>

                        <p>Nonce は別途クライアントに送信し、認証時に再送させる</p>
                        <p>Nonce がトークンのものと異なる場合は認証失敗とし、認証情報を失効させる</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">APIトークン</dt>
                    <dd class="form__field">
                        <p>API サーバーを使用するために必要な認証情報</p>
                        <p>適切な方法で署名する</p>
                        <p>署名の検証は API サーバーで行う</p>
                        <small><p>(検証に必要な鍵情報は API サーバーに提供する）</p></small>
                        <p>API トークンの有効期限は5分程度とする</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">コンテンツトークン</dt>
                    <dd class="form__field">
                        <p>プライベートコンテンツにアクセスするために必要な認証情報</p>
                        <p>適切な方法で署名する</p>
                        <p>署名の検証はコンテンツサーバーで行う</p>
                        <p>コンテンツトークンの有効期限は API トークンと同じ</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">チケット最大延長期間</dt>
                    <dd class="form__field">
                        <p>リクエスト時刻から既定の時間だけ延長が可能</p>
                        <p>認証の方法によって、異なる延長期間を設定</p>
                        <small><p>(パスワードなら短め、Web 証明書認証なら長めを想定）</p></small>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">チケット有効期限</dt>
                    <dd class="form__field">
                        <p>リクエスト時刻から既定の時間だけ有効</p>
                        <p>認証の方法によらず、有効期限は一定</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">トークン有効期限</dt>
                    <dd class="form__field">
                        <p>リクエスト時刻から既定の時間だけ有効</p>
                        <p>認証の方法によらず、有効期限は一定</p>
                        <p>
                            APIトークン・コンテンツトークンはそれぞれのサーバーに指定される方法で送信するので、漏洩した際の影響を小さくするため短い有効期限を設定する
                        </p>
                    </dd>
                </dl>`
        )}
        ${box_double(
            "チケット",
            html` <dl class="form">
                    <dt class="form__header">ACTION</dt>
                    <dd class="form__field">
                        <ul>
                            <li>チケット登録</li>
                            <li>チケット検証</li>
                            <li>チケット有効期限延長</li>
                            <li>チケット無効化</li>
                        </ul>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">チケットデータ保管</dt>
                    <dd class="form__field">
                        <p>以下のデータをデータベースに保管</p>
                        <ul>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small> ユーザー
                            </li>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small> 有効期限
                            </li>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small>
                                最大延長期間
                            </li>
                        </ul>

                        <div class="vertical vertical_small"></div>

                        <p>ユーザーについてチケットトークンとデータベースが一致することを検証</p>
                        <p>有効期限はデータベースに保管されたものを使用して検証</p>
                        <p>検証が失敗した場合は認証情報を失効させる</p>
                        <p>チケットの無効化はデータベースの有効期限・最大延長期間を無効化</p>
                    </dd>
                </dl>`
        )}
        ${box(
            "ユーザー",
            html` <dl class="form">
                    <dt class="form__header">ACTION</dt>
                    <dd class="form__field">
                        <ul>
                            <li>ログインID取得</li>
                            <li>ユーザーID取得</li>
                        </ul>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">ユーザー</dt>
                    <dd class="form__field">
                        <p>ユーザーID・ログインIDを持つ</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">ユーザーID</dt>
                    <dd class="form__field">
                        <p>機械的にユーザーを識別する</p>
                        <p>全ユーザーの間で一意</p>
                        <p>予測不可能な文字列</p>
                        <p>登録時に生成して割り当て</p>
                        <p>変更されない</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">ログインID</dt>
                    <dd class="form__field">
                        <p>ログインするのに使用する</p>
                        <p>全ユーザーの間で一意</p>
                        <p>ユーザーの都合で変更可能</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">ユーザーID取得</dt>
                    <dd class="form__field">
                        <p>ログインIDからユーザーIDを取得</p>
                        <p>登録されていない場合は取得失敗</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">ログインID取得</dt>
                    <dd class="form__field">
                        <p>チケットトークンのユーザーからログインIDを取得</p>
                        <p>基本取得に失敗することはない</p>
                    </dd>
                </dl>`
        )}
        ${box(
            "パスワード",
            html` <dl class="form">
                    <dt class="form__header">ACTION</dt>
                    <dd class="form__field">
                        <ul>
                            <li>パスワード検証</li>
                            <li>パスワード変更</li>
                        </ul>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">入力パスワード</dt>
                    <dd class="form__field">
                        <p>ユーザーが入力したパスワード</p>
                        <p>メモリ以外に保管してはならない</p>
                        <p>空のパスワードは無効</p>
                        <p>長いパスワードは無効</p>
                        <small><p>（bcrypt を想定しているので、72バイト以上は無効）</p></small>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">ハッシュ化パスワード</dt>
                    <dd class="form__field">
                        <p>ユーザーが入力したパスワードにハッシュ関数を適用した文字列</p>
                        <p>データベースに保管する</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">パスワード検証</dt>
                    <dd class="form__field">
                        <p>入力パスワードが一致するかはハッシュ関数を使用して検証</p>
                        <small><p>（ハッシュ関数を適用して文字列一致するのではない）</p></small>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">パスワード変更</dt>
                    <dd class="form__field">
                        <p>新しいパスワードに変更</p>
                        <p>古いパスワードは使用不可能になる</p>
                    </dd>
                </dl>`
        )}
        ${box(
            "パスワードリセット",
            html` <dl class="form">
                    <dt class="form__header">ACTION</dt>
                    <dd class="form__field">
                        <ul>
                            <li>セッション生成</li>
                            <li>トークン送信 Job 生成</li>
                            <li>トークン送信</li>
                            <li>ステータス取得</li>
                            <li>トークン検証</li>
                            <li>セッション完了</li>
                        </ul>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">リセットセッション</dt>
                    <dd class="form__field">
                        <p>パスワードがわからなくなったときにリセットを可能にする</p>
                        <p>有効期限は1時間程度を想定</p>
                        <small><p>（メッセージクライアントが遅延することを見込んでおく）</p></small>
                        <p>パスワードのリセットが終わったらセッションは完了</p>
                        <p>完了したセッションではパスワードはリセットできない</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">セッションID</dt>
                    <dd class="form__field">
                        <p>セッションを識別する</p>
                        <p>全セッションの間で一意</p>
                        <p>予測不可能な文字列</p>
                        <p>生成時に生成して割り当て</p>
                        <p>変更されない</p>
                        <p>セッションを開始したクライアントに返信</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">トークン</dt>
                    <dd class="form__field">
                        <p>パスワードリセットの検証に使用</p>
                        <p>全セッションの間で一意</p>
                        <p>予測不可能な文字列</p>
                        <p>生成時に生成して割り当て</p>
                        <p>変更されない</p>
                        <p>あらかじめユーザーに割り当てられたメッセージクライアントに送信</p>
                        <small><p>（セッションを開始したクライアントには直接送信しない）</p></small>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">有効期限</dt>
                    <dd class="form__field">
                        <p>リクエスト時刻から既定の時間だけ有効</p>
                        <p>宛先によらず、有効期限は一定</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">セッションデータ</dt>
                    <dd class="form__field">
                        <p>以下のデータを含む</p>
                        <ul>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small> ユーザー
                            </li>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small>
                                リセット時ログインID
                            </li>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small>
                                リクエスト時刻
                            </li>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small> 有効期限
                            </li>
                        </ul>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">宛先</dt>
                    <dd class="form__field">
                        <p>以下の種類を想定</p>
                        <ul>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small>
                                ログメッセージに出力
                            </li>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small> Slack Channel
                                に送信
                            </li>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small>
                                メールアドレスに送信
                            </li>
                        </ul>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">ステータス</dt>
                    <dd class="form__field">
                        <p>メッセージの送信状態の確認に使用</p>
                        <ul>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small> 待機中 : 作成時刻
                            </li>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small> 送信中 :
                                処理開始時刻
                            </li>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small> 完了 : 完了時刻
                            </li>
                            <li>
                                <small><i class="lnir lnir-chevron-right"></i></small> 失敗 :
                                失敗時刻・理由
                            </li>
                        </ul>
                    </dd>
                </dl>`
        )}
        ${box(
            "リクエスト",
            html` <dl class="form">
                <dt class="form__header">リクエスト情報</dt>
                <dd class="form__field">
                    <p>以下のデータを含む</p>
                    <ul>
                        <li>
                            <small><i class="lnir lnir-chevron-right"></i></small>
                            リクエスト時刻
                        </li>
                        <li>
                            <small><i class="lnir lnir-chevron-right"></i></small>
                            経路情報（リモートIP）
                        </li>
                    </ul>

                    <div class="vertical vertical_small"></div>

                    <p>アプリケーションログに記録する</p>
                    <p>http クライアントを想定しているのでこのデータになっている</p>
                </dd>
            </dl>`
        )}
    `
}

function detail_renew() {
    return html`
        ${box(
            "継続認証",
            html` <p>ApiRoles 登録なしで「権限なし」</p>
                <p>最大延長期間まで延長可能</p>
                <p>有効期限切れで認証エラー</p>
                <p>ログアウト済みで認証エラー</p>
                <p>チケット登録なしで認証エラー</p>
                <p>Nonce 不一致で認証エラー</p>
                <p>ユーザー不一致で認証エラー</p>`
        )}
        ${box("ログアウト", html` <p>有効期限切れで認証エラー</p>`)}
    `
}
function detail_password() {
    return html`
        ${box(
            "パスワードログイン",
            html` <p>パスワード登録なしで認証エラー</p>
                <p>パスワード不一致で認証エラー</p>
                <p>空のパスワードで認証エラー</p>
                <p>長いパスワードで認証エラー</p>
                <p>ぎりぎりの長さで認証成功</p>`
        )}
        ${box(
            "パスワード変更",
            html` <p>変更後は古いパスワードは無効</p>

                <div class="vertical vertical_small"></div>

                <dl class="form">
                    <dt class="form__header">GetLogin</dt>
                    <dd class="form__field">
                        <p>有効期限切れで認証エラー</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">Change</dt>
                    <dd class="form__field">
                        <p>有効期限切れで認証エラー</p>
                        <p>旧パスワード不一致で変更エラー</p>
                        <p>空のパスワードで変更エラー</p>
                        <p>長いパスワードで変更エラー</p>
                        <p>ぎりぎりの長さで変更成功</p>
                    </dd>
                </dl>`
        )}
        ${box(
            "パスワードリセット",
            html` <p>変更後は古いパスワードは無効</p>
                <p>変更後はセッションは無効</p>

                <div class="vertical vertical_small"></div>

                <dl class="form">
                    <dt class="form__header">CreateSession</dt>
                    <dd class="form__field">
                        <p>不明なログインIDで生成エラー</p>
                        <p>宛先未登録で生成エラー</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">GetStatus</dt>
                    <dd class="form__field">
                        <p>不明なセッションIDで取得エラー</p>
                        <p>不明なログインIDで取得エラー</p>
                        <p>ログインID不一致で取得エラー</p>
                    </dd>
                </dl>

                <dl class="form">
                    <dt class="form__header">Reset</dt>
                    <dd class="form__field">
                        <p>不明なセッションIDでリセットエラー</p>
                        <p>有効期限切れでリセットエラー</p>
                        <p>有効期限ぎりぎりでリセット成功</p>
                        <p>不明なログインIDでリセットエラー</p>
                        <p>ログインID不一致でリセットエラー</p>
                        <p>不正なパスワードでリセットエラー</p>
                    </dd>
                </dl>`
        )}
    `
}

const hr = html`<hr />`

const contentServer = html`<i class="lnir lnir-database"></i> コンテンツサーバー`
const apiServer = html`<i class="lnir lnir-cogs"></i> API サーバー`
const browser = html`<i class="lnir lnir-display"></i> ブラウザ`
const textMessage = html`<i class="lnir lnir-envelope"></i> テキストメッセージクライアント`

function inBrowser(content: VNodeContent, help: VNodeContent[]) {
    return form(browser, content, help)
}

function toContentServer(content: VNodeContent, help: VNodeContent[]) {
    return toServer(contentServer, content, help)
}
function inContentServer(content: VNodeContent, help: VNodeContent[]) {
    return form(contentServer, content, help)
}

function toApiServer(content: VNodeContent, help: VNodeContent[]) {
    return toServer(apiServer, content, help)
}
function inApiServer(content: VNodeContent, help: VNodeContent[]) {
    return form(apiServer, content, help)
}
function fromApiServer(content: VNodeContent, help: VNodeContent[]) {
    return fromServer(apiServer, content, help)
}

function toTextMessage(content: VNodeContent, help: VNodeContent[]) {
    return form(
        html`
            ${apiServer} ${" "}
            <i class="lnir lnir-arrow-right"></i>
            ${" "} ${textMessage}
        `,
        content,
        help
    )
}

function toServer(server: VNodeContent, content: VNodeContent, help: VNodeContent[]) {
    return form(
        html`
            ${browser} ${" "}
            <i class="lnir lnir-arrow-right"></i>
            ${" "} ${server}
        `,
        content,
        help
    )
}
function fromServer(server: VNodeContent, content: VNodeContent, help: VNodeContent[]) {
    return form(
        html`
            ${server} ${" "}
            <i class="lnir lnir-arrow-right"></i>
            ${" "} ${browser}
        `,
        content,
        help
    )
}
