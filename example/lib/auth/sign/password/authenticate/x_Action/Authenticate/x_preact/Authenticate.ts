import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { VNodeContent } from "../../../../../../../z_vendor/getto-css/preact/common"
import { loginBox } from "../../../../../../../z_vendor/getto-css/preact/layout/login"
import {
    buttons,
    button_disabled,
    button_send,
    button_undo,
    fieldError,
    form,
} from "../../../../../../../z_vendor/getto-css/preact/design/form"

import { useApplicationAction, useEntryPoint } from "../../../../../../../x_preact/common/hooks"
import { siteInfo } from "../../../../../../../x_preact/common/site"
import { icon, spinner } from "../../../../../../../x_preact/common/icon"

import { appendScript } from "../../../../../../../x_preact/auth/Sign/script"

import { ApplicationError } from "../../../../../../../x_preact/common/System/ApplicationError"
import { LoginIDBoard } from "../../../../../../common/board/loginID/x_Action/LoginID/x_preact/LoginID"
import { PasswordBoard } from "../../../../../../common/board/password/x_Action/Password/x_preact/Password"

import { AuthenticatePasswordEntryPoint, initialAuthenticatePasswordState } from "../action"

import { AuthenticatePasswordError } from "../../../data"

export function AuthenticatePassword(entryPoint: AuthenticatePasswordEntryPoint): VNode {
    const resource = useEntryPoint(entryPoint)

    const state = useApplicationAction(resource.core, initialAuthenticatePasswordState.core)
    const validateState = useApplicationAction(resource.form.validate, initialAuthenticatePasswordState.form)

    useEffect(() => {
        // スクリプトのロードは appendChild する必要があるため useEffect で行う
        switch (state.type) {
            case "try-to-load":
                appendScript(state.scriptPath, (script) => {
                    script.onerror = () => {
                        resource.core.loadError({
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
                    h(LoginIDBoard, { field: resource.form.loginID, help: [] }),
                    h(PasswordBoard, { field: resource.form.password, help: [] }),
                    buttons({ right: clearButton() }),
                ],
                footer: [buttons({ left: button(), right: resetLink() }), error()],
            })
        )

        function clearButton() {
            const label = "入力内容をクリア"
            switch (validateState) {
                case "initial":
                    return button_disabled({ label })

                case "invalid":
                case "valid":
                    return button_undo({ label, onClick })
            }

            function onClick(e: Event) {
                e.preventDefault()
                resource.form.clear()
            }
        }

        function button() {
            switch (content.state) {
                case "login":
                    return loginButton()

                case "connecting":
                    return connectingButton()
            }

            function loginButton() {
                const label = "ログイン"

                switch (validateState) {
                    case "initial":
                        return button_send({ state: "normal", label, onClick })

                    case "valid":
                        return button_send({ state: "confirm", label, onClick })

                    case "invalid":
                        return button_disabled({ label })
                }

                function onClick(e: Event) {
                    e.preventDefault()
                    resource.core.submit(resource.form.validate.get())
                }
            }
            function connectingButton(): VNode {
                return button_send({
                    state: "connect",
                    label: html`ログインしています ${spinner}`,
                })
            }
        }

        function error() {
            if ("error" in content) {
                return fieldError(content.error)
            }

            switch (validateState) {
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
        return html`<a href="${resource.href.passwordResetSession()}">
            ${icon("question-circle")} パスワードがわからない方
        </a>`
    }
}

function loginError(err: AuthenticatePasswordError): VNodeContent[] {
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
            return ["レスポンスエラーにより認証に失敗しました", ...detail(err.err)]

        case "infra-error":
            return ["ネットワークエラーにより認証に失敗しました", ...detail(err.err)]
    }
}

function detail(err: string): string[] {
    if (err.length === 0) {
        return []
    }
    return [`(詳細: ${err})`]
}

const EMPTY_CONTENT = html``
