import { RenewAction, SetContinuousRenewAction } from "../../login/renew/action"
import { SecureScriptPathAction } from "../../common/application/action"

import { StorageError, RenewError } from "../../login/renew/data"
import { ScriptPath, LoadError } from "../../common/application/data"

export interface RenewCredentialComponentFactory {
    (material: RenewCredentialMaterial): RenewCredentialComponent
}

export type RenewCredentialMaterial = Readonly<{
    renew: RenewAction
    setContinuousRenew: SetContinuousRenewAction
    secureScriptPath: SecureScriptPathAction
}>

export interface RenewCredentialComponent {
    onStateChange(post: Post<RenewCredentialState>): void
    renew(): void
    succeedToInstantLoad(): void
    loadError(err: LoadError): void
}

export type RenewCredentialState =
    | Readonly<{ type: "initial" }>
    | Readonly<{ type: "try-to-instant-load"; scriptPath: ScriptPath }>
    | Readonly<{ type: "required-to-login" }>
    | Readonly<{ type: "try-to-renew" }>
    | Readonly<{ type: "delayed-to-renew" }>
    | Readonly<{ type: "succeed-to-renew"; scriptPath: ScriptPath }>
    | Readonly<{ type: "failed-to-renew"; err: RenewError }>
    | Readonly<{ type: "load-error"; err: LoadError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "error"; err: string }>

export const initialRenewCredentialState: RenewCredentialState = { type: "initial" }

interface Post<T> {
    (state: T): void
}
