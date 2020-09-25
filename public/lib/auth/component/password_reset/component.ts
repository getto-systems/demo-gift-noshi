import { LoginIDFieldState } from "../field/login_id/component"
import { PasswordFieldState } from "../field/password/component"

import { PasswordResetAction } from "../../../password_reset/action"
import { LoginIDFieldAction } from "../../../field/login_id/action"
import { PasswordFieldAction } from "../../../field/password/action"

import { AuthCredential } from "../../../credential/data"
import { ResetToken, ResetError } from "../../../password_reset/data"
import { LoginIDFieldOperation } from "../../../field/login_id/data"
import { PasswordFieldOperation } from "../../../field/password/data"

export interface PasswordResetComponent {
    onStateChange(stateChanged: Post<PasswordResetState>): void
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void
    onPasswordFieldStateChange(stateChanged: Post<PasswordFieldState>): void
    init(): void
    terminate(): void
    trigger(operation: PasswordResetComponentOperation): Promise<void>
}

export type PasswordResetParam = { PasswordResetParam: never }

export type PasswordResetState =
    Readonly<{ type: "initial-reset" }> |
    Readonly<{ type: "try-to-reset" }> |
    Readonly<{ type: "delayed-to-reset" }> |
    Readonly<{ type: "failed-to-reset", err: ResetError }> |
    Readonly<{ type: "succeed-to-reset", authCredential: AuthCredential }>

export const initialPasswordResetState: PasswordResetState = { type: "initial-reset" }

export type PasswordResetComponentOperation =
    Readonly<{ type: "reset", resetToken: ResetToken }> |
    Readonly<{ type: "field-login_id", operation: LoginIDFieldOperation }> |
    Readonly<{ type: "field-password", operation: PasswordFieldOperation }>

export interface PasswordResetWorkerComponentHelper {
    mapPasswordResetState(state: PasswordResetState): PasswordResetWorkerState
    mapLoginIDFieldState(state: LoginIDFieldState): PasswordResetWorkerState
    mapPasswordFieldState(state: PasswordFieldState): PasswordResetWorkerState
}

export type PasswordResetWorkerState =
    Readonly<{ type: "password_reset", state: PasswordResetState }> |
    Readonly<{ type: "field-login_id", state: LoginIDFieldState }> |
    Readonly<{ type: "field-password", state: PasswordFieldState }>

export interface PasswordResetComponentAction {
    passwordReset: PasswordResetAction
    loginIDField: LoginIDFieldAction
    passwordField: PasswordFieldAction
}

export type PasswordResetParamEvent =
    Readonly<{ type: "succeed-to-load", resetToken: ResetToken }>

export interface PasswordResetParamEventPublisher {
    postPasswordResetParamEvent(event: PasswordResetParamEvent): void
}

export interface PasswordResetParamEventSubscriber {
    onPasswordResetParamEvent(stateChanged: Post<PasswordResetParamEvent>): void
}

interface Post<T> {
    (state: T): void
}
