import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { VNodeContent } from "../../../z_vendor/getto-css/preact/common"
import { loginBox } from "../../../z_vendor/getto-css/preact/layout/login"
import {
    buttons,
    button_disabled,
    button_send,
    fieldError,
    form,
} from "../../../z_vendor/getto-css/preact/design/form"

import { useComponent } from "../../common/hooks"
import { siteInfo } from "../../common/site"
import { icon, spinner } from "../../common/icon"

import { appendScript } from "./script"

import { ApplicationError } from "../../common/System/ApplicationError"

import { LoginIDFormField } from "./field/loginID"
import { PasswordFormField } from "./field/password"

import { PasswordLoginResource } from "../../../auth/Auth/Login/entryPoint"
import { initialPasswordLoginComponentState } from "../../../auth/Auth/passwordLogin/component"

import { LoginError } from "../../../auth/login/passwordLogin/data"
import { initialFormComponentState } from "../../../sub/getto-form/component/component"

type Props = PasswordLoginResource
export function PasswordLogin(resource: Props): VNode {
    const { passwordLogin } = resource
    const state = useComponent(passwordLogin, initialPasswordLoginComponentState)
    const formState = useComponent(resource.form, initialFormComponentState)

    useEffect(() => {
        // スクリプトのロードは appendChild する必要があるため useEffect で行う
        switch (state.type) {
            case "try-to-load":
                appendScript(state.scriptPath, (script) => {
                    script.onerror = () => {
                        passwordLogin.loadError({
                            type: "infra-error",
                            err: `スクリプトのロードに失敗しました: ${state.type}`,
                        })
                    }
                })
                break
        }
    }, [state])

    switch (state.type) {
        case "initial-login":
            return loginForm({ state: "login" })

        case "failed-to-login":
            return loginForm({ state: "login", error: loginError(state.err) })

        case "try-to-login":
            return loginForm({ state: "connecting" })

        case "delayed-to-login":
            return delayedMessage()

        case "try-to-load":
            // スクリプトのロードは appendChild する必要があるため useEffect で行う
            return EMPTY_CONTENT

        case "storage-error":
        case "load-error":
            return h(ApplicationError, { err: state.err.err })

        case "error":
            return h(ApplicationError, { err: state.err })
    }

    type LoginFormState = "login" | "connecting"

    type LoginFormContent = LoginFormContent_base | (LoginFormContent_base & LoginFormContent_error)
    type LoginFormContent_base = Readonly<{ state: LoginFormState }>
    type LoginFormContent_error = Readonly<{ error: VNodeContent[] }>

    function loginTitle() {
        return "ログイン"
    }

    function loginForm(content: LoginFormContent): VNode {
        return form(
            loginBox(siteInfo(), {
                title: loginTitle(),
                body: [
                    h(LoginIDFormField, { loginID: resource.form.loginID, help: [] }),
                    h(PasswordFormField, { password: resource.form.password, help: [] }),
                ],
                footer: [buttons({ left: button(), right: resetLink() }), error()],
            })
        )

        function button() {
            switch (content.state) {
                case "login":
                    return loginButton()

                case "connecting":
                    return connectingButton()
            }

            function loginButton() {
                switch (formState.validation) {
                    case "initial":
                        return button_send({ state: "normal", label: "ログイン", onClick })

                    case "valid":
                        return button_send({ state: "confirm", label: "ログイン", onClick })

                    case "invalid":
                        return button_disabled({ label: "ログイン" })
                }

                function onClick(e: Event) {
                    e.preventDefault()
                    console.log(resource.form.getLoginFields())
                    // TODO passwordLogin.login()
                    alert("ここでログイン！")
                }
            }
            function connectingButton(): VNode {
                return button_send({ state: "connect", label: html`ログインしています ${spinner}` })
            }
        }

        function error() {
            if ("error" in content) {
                return fieldError(content.error)
            }

            switch (formState.validation) {
                case "initial":
                case "valid":
                    return ""

                case "invalid":
                    return fieldError(["正しく入力されていません"])
            }
        }
    }
    function delayedMessage() {
        return loginBox(siteInfo(), {
            title: loginTitle(),
            body: [
                html`<p>${spinner} 認証中です</p>`,
                html`<p>
                    30秒以上かかる場合は何かがおかしいので、
                    <br />
                    お手数ですが管理者に連絡お願いします
                </p>`,
            ],
            footer: buttons({ right: resetLink() }),
        })
    }

    function resetLink() {
        return html`<a href="${passwordLogin.link.passwordResetSession()}">
            ${icon("question-circle")} パスワードがわからない方
        </a>`
    }
}

function loginError(err: LoginError): VNodeContent[] {
    switch (err.type) {
        case "validation-error":
            return ["正しく入力してください"]

        case "bad-request":
            return ["アプリケーションエラーにより認証に失敗しました"]

        case "invalid-password-login":
            return ["ログインIDかパスワードが違います"]

        case "server-error":
            return ["サーバーエラーにより認証に失敗しました"]

        case "bad-response":
            return ["レスポンスエラーにより認証に失敗しました", `(詳細: ${err.err})`]

        case "infra-error":
            return ["ネットワークエラーにより認証に失敗しました", `(詳細: ${err.err})`]
    }
}

const EMPTY_CONTENT = html``
