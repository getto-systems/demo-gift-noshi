import { ApplicationComponent } from "../../../../../../vendor/getto-example/Application/component"

import { AuthenticatePasswordAction } from "../../../../password/authenticate/action"
import { GetSecureScriptPathAction } from "../../../../secureScriptPath/get/action"
import { StartContinuousRenewAuthCredentialAction } from "../../../../authCredential/startContinuousRenew/action"

import { FormConvertResult } from "../../../../../../vendor/getto-form/form/data"
import { SecureScriptPath, LoadSecureScriptError } from "../../../../secureScriptPath/get/data"
import { AuthenticatePasswordError, PasswordLoginFields } from "../../../../password/authenticate/data"
import { StorageError } from "../../../../../../common/storage/data"

export interface PasswordLoginComponent extends ApplicationComponent<PasswordLoginComponentState> {
    submit(fields: FormConvertResult<PasswordLoginFields>): void
    loadError(err: LoadSecureScriptError): void
}

export type PasswordLoginMaterial = Readonly<{
    continuousRenew: StartContinuousRenewAuthCredentialAction
    location: GetSecureScriptPathAction
    login: AuthenticatePasswordAction
}>

export type PasswordLoginComponentState =
    | Readonly<{ type: "initial-login" }>
    | Readonly<{ type: "try-to-login" }>
    | Readonly<{ type: "delayed-to-login" }>
    | Readonly<{ type: "try-to-load"; scriptPath: SecureScriptPath }>
    | Readonly<{ type: "failed-to-login"; err: AuthenticatePasswordError }>
    | Readonly<{ type: "storage-error"; err: StorageError }>
    | Readonly<{ type: "load-error"; err: LoadSecureScriptError }>
    | Readonly<{ type: "error"; err: string }>

export const initialPasswordLoginComponentState: PasswordLoginComponentState = { type: "initial-login" }
