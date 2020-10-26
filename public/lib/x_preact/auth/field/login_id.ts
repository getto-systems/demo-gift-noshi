import { VNode } from "preact"
import { html } from "htm/preact"

import { mapInputEvent } from "./common"

import { LoginIDFieldComponent } from "../../../auth/component/field/login_id/component"

import { LoginIDFieldError } from "../../../login_id/field/data"
import { Valid } from "../../../field/data"

export interface LoginIDFieldHandler {
    onInput(event: InputEvent): void
}

export function loginIDFieldHandler(loginIDField: LoginIDFieldComponent): LoginIDFieldHandler {
    return {
        onInput: mapInputEvent((loginID) => {
            loginIDField.action({ type: "set", inputValue: loginID })
        }),
    }
}

export function loginIDFieldError(result: Valid<LoginIDFieldError>): VNode[] {
    if (result.valid) {
        return []
    }

    return result.err.map((err) => {
        switch (err) {
            case "empty":
                return html`<p class="form__message">ログインIDを入力してください</p>`
        }
    })
}
