import { ResetComponent } from "./Reset/component"
import { FormComponent } from "./Form/component"

import { FormAction } from "../../../../vendor/getto-form/form/action"
import { LocationAction } from "../../../sign/location/action"
import { LoginIDFormFieldAction } from "../../../common/field/loginID/action"
import { PasswordFormFieldAction } from "../../../common/field/password/action"
import {
    RegisterActionLocationInfo,
    RegisterActionPod,
} from "../../../sign/password/reset/register/action"
import { ContinuousRenewAction } from "../../../sign/authCredential/continuousRenew/action"

export type PasswordResetResource = Readonly<{
    reset: ResetComponent
    form: FormComponent
}>

export type PasswordResetLocationInfo = RegisterActionLocationInfo
export type PasswordResetForegroundAction = Readonly<{
    continuousRenew: ContinuousRenewAction
    location: LocationAction

    form: Readonly<{
        core: FormAction
        loginID: LoginIDFormFieldAction
        password: PasswordFormFieldAction
    }>
}>
export type PasswordResetBackgroundActionPod = Readonly<{
    initRegister: RegisterActionPod
}>
