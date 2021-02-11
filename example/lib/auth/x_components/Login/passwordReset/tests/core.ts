import {
    initTestApplicationAction,
    initTestSetContinuousRenewAction,
    initTestPasswordResetAction,
    initPasswordResetLocationInfo,
} from "../../EntryPoint/tests/core"

import { initLoginLink } from "../../EntryPoint/main/link"
import { initPasswordResetResource, PasswordResetFactory } from "../../EntryPoint/impl/reset"

import { initPasswordResetComponent, initPasswordResetFormComponent } from "../impl"
import { initFormAction } from "../../../../../sub/getto-form/main/form"
import { initLoginIDFormFieldAction, initPasswordFormFieldAction } from "../../EntryPoint/main/action/form"

import { Clock } from "../../../../../z_infra/clock/infra"
import { ApplicationActionConfig } from "../../../../common/application/infra"
import { PasswordResetActionConfig, ResetRemoteAccess } from "../../../../profile/passwordReset/infra"
import {
    SetContinuousRenewActionConfig,
    AuthCredentialRepository,
    RenewRemoteAccess,
} from "../../../../login/credentialStore/infra"

import { PasswordResetResource } from "../../EntryPoint/entryPoint"

export type PasswordResetConfig = {
    application: ApplicationActionConfig
    passwordReset: PasswordResetActionConfig
    setContinuousRenew: SetContinuousRenewActionConfig
}
export type PasswordResetRepository = Readonly<{
    authCredentials: AuthCredentialRepository
}>
export type PasswordResetRemoteAccess = Readonly<{
    reset: ResetRemoteAccess
    renew: RenewRemoteAccess
}>

export function newTestPasswordResetResource(
    currentURL: URL,
    config: PasswordResetConfig,
    repository: PasswordResetRepository,
    remote: PasswordResetRemoteAccess,
    clock: Clock
): PasswordResetResource {
    const factory: PasswordResetFactory = {
        link: initLoginLink,
        actions: {
            application: initTestApplicationAction(config.application),
            setContinuousRenew: initTestSetContinuousRenewAction(
                config.setContinuousRenew,
                repository.authCredentials,
                remote.renew,
                clock
            ),

            passwordReset: initTestPasswordResetAction(config.passwordReset, remote.reset),

            form: {
                core: initFormAction(),
                loginID: initLoginIDFormFieldAction(),
                password: initPasswordFormFieldAction(),
            },
        },
        components: {
            passwordReset: { core: initPasswordResetComponent, form: initPasswordResetFormComponent },
        },
    }

    return initPasswordResetResource(factory, initPasswordResetLocationInfo(currentURL))
}
