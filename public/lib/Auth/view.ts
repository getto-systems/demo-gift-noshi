import { AppHref } from "../Href/data"

import { RenewCredentialComponent } from "./component/renew_credential/component"

import { PasswordLoginComponent } from "./component/password_login/component"
import { PasswordResetSessionComponent } from "./component/password_reset_session/component"
import { PasswordResetComponent } from "./component/password_reset/component"

import { LoginIDFieldComponent } from "./component/field/login_id/component"
import { PasswordFieldComponent } from "./component/field/password/component"

export interface AuthViewFactory {
    (): AuthResource
}
export type AuthResource = Readonly<{
    view: AuthView
    terminate: Terminate
}>

export interface AuthView {
    onStateChange(post: Post<AuthState>): void
    load(): void
}

export type AuthState =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "renew-credential"; components: RenewCredentialComponentSet }>
    | Readonly<{ type: "password-login"; components: PasswordLoginComponentSet }>
    | Readonly<{ type: "password-reset-session"; components: PasswordResetSessionComponentSet }>
    | Readonly<{ type: "password-reset"; components: PasswordResetComponentSet }>
    | Readonly<{ type: "error"; err: string }>

export const initialAuthState: AuthState = { type: "initial" }

export type RenewCredentialComponentSet = Readonly<{
    renewCredential: RenewCredentialComponent
}>
export type PasswordLoginComponentSet = Readonly<{
    href: AppHref
    passwordLogin: PasswordLoginComponent
    loginIDField: LoginIDFieldComponent
    passwordField: PasswordFieldComponent
}>
export type PasswordResetSessionComponentSet = Readonly<{
    href: AppHref
    passwordResetSession: PasswordResetSessionComponent
    loginIDField: LoginIDFieldComponent
}>
export type PasswordResetComponentSet = Readonly<{
    href: AppHref
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