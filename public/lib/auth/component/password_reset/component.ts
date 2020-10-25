import { ResetAction } from "../../../password_reset/action"
import { StoreAction } from "../../../credential/action"
import { SecureScriptPathAction } from "../../../application/action"

import { ResetToken, ResetError } from "../../../password_reset/data"
import { StorageError } from "../../../credential/data"
import { PagePathname, ScriptPath, LoadError } from "../../../application/data"

export interface PasswordResetInit {
    (actions: PasswordResetActionSet, param: PasswordResetParam): PasswordResetComponent
}

export type PasswordResetActionSet = Readonly<{
    reset: ResetAction
    store: StoreAction
    secureScriptPath: SecureScriptPathAction
}>

export type PasswordResetParam = Readonly<{
    pagePathname: PagePathname
    resetToken: ResetToken
}>

export interface PasswordResetComponent {
    onStateChange(post: Post<PasswordResetState>): void
    action(request: PasswordResetRequest): void
}

export type PasswordResetState =
    | Readonly<{ type: "initial-reset" }>
    | Readonly<{ type: "try-to-reset" }>
    | Readonly<{ type: "delayed-to-reset" }>
    | Readonly<{ type: "failed-to-reset"; err: ResetError }>
    | Readonly<{ type: "succeed-to-reset"; scriptPath: ScriptPath }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "error"; err: string }>

export const initialPasswordResetState: PasswordResetState = { type: "initial-reset" }

export type PasswordResetRequest =
    | Readonly<{ type: "reset" }>
    | Readonly<{ type: "load-error"; err: LoadError }>

interface Post<T> {
    (state: T): void
}
