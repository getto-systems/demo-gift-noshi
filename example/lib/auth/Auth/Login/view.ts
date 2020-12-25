import { RenewCredentialComponent } from "../renewCredential/component"

import { PasswordLoginComponent } from "../passwordLogin/component"
import { PasswordResetSessionComponent } from "../passwordResetSession/component"
import { PasswordResetComponent } from "../passwordReset/component"

import { LoginIDFieldComponent } from "../field/loginID/component"
import { PasswordFieldComponent } from "../field/password/component"

export type LoginEntryPoint = Readonly<{
    view: LoginView
    terminate: Terminate
}>

export interface LoginView {
    onStateChange(post: Post<LoginState>): void
    load(): void
}

export type LoginState =
    | Readonly<{ type: "initial-view" }>
    | Readonly<{ type: "renew-credential"; resource: RenewCredentialResource }>
    | Readonly<{ type: "password-login"; resource: PasswordLoginResource }>
    | Readonly<{ type: "password-reset-session"; resource: PasswordResetSessionResource }>
    | Readonly<{ type: "password-reset"; resource: PasswordResetResource }>
    | Readonly<{ type: "error"; err: string }>

export type ViewState = "password-login" | "password-reset-session" | "password-reset"

export const initialLoginState: LoginState = { type: "initial-view" }

export type RenewCredentialResource = Readonly<{
    renewCredential: RenewCredentialComponent
}>
export type PasswordLoginResource = Readonly<{
    passwordLogin: PasswordLoginComponent
    loginIDField: LoginIDFieldComponent
    passwordField: PasswordFieldComponent
}>
export type PasswordResetSessionResource = Readonly<{
    passwordResetSession: PasswordResetSessionComponent
    loginIDField: LoginIDFieldComponent
}>
export type PasswordResetResource = Readonly<{
    passwordReset: PasswordResetComponent
    loginIDField: LoginIDFieldComponent
    passwordField: PasswordFieldComponent
}>

interface Post<T> {
    (state: T): void
}
interface Terminate {
    (): void
}
