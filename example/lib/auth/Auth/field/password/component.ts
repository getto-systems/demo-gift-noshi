import { ApplicationComponent } from "../../../../sub/getto-example/application/component"

import { PasswordField } from "../../../common/field/password/action"

import { PasswordFieldEvent } from "../../../common/field/password/event"

import {
    PasswordFieldError,
    PasswordCharacter,
    simplePassword,
    PasswordView,
    hidePassword,
} from "../../../common/field/password/data"
import { InputValue, Valid, noError } from "../../../common/field/data"

export interface PasswordFieldComponentFactory {
    (material: PasswordFieldMaterial): PasswordFieldComponent
}
export type PasswordFieldMaterial = Readonly<{
    password: PasswordField
}>

export interface PasswordFieldComponent extends ApplicationComponent<PasswordFieldState> {
    set(inputValue: InputValue): void
    show(): void
    hide(): void
    validate(handler: Handler<PasswordFieldEvent>): void
}

// TODO variant が 1つなら type いらない
export type PasswordFieldState = Readonly<{
    type: "succeed-to-update"
    result: Valid<PasswordFieldError>
    character: PasswordCharacter
    view: PasswordView
}>

export const initialPasswordFieldState: PasswordFieldState = {
    type: "succeed-to-update",
    result: noError(),
    character: simplePassword,
    view: hidePassword,
}

interface Handler<T> {
    (state: T): void
}
