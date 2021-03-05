import { ApplicationStateAction } from "../../../../../../../z_vendor/getto-application/action/action"

import { SignLinkResource } from "../../../../../common/link/Action/action"

import { CheckSendingStatusMethod, CheckSendingStatusMethodPod } from "../../method"

import { CheckSendingStatusEvent } from "../../event"

export type CheckPasswordResetSendingStatusEntryPoint = Readonly<{
    resource: CheckPasswordResetSendingStatusResource
    terminate: { (): void }
}>

export type CheckPasswordResetSendingStatusResource = SignLinkResource &
    Readonly<{ checkStatus: CheckPasswordResetSendingStatusAction }>

export type CheckPasswordResetSendingStatusAction = ApplicationStateAction<CheckSendingStatusState>

export type CheckSendingStatusMaterial = Readonly<{
    checkStatus: CheckSendingStatusMethod
}>
export type CheckSendingStatusMaterialPod = Readonly<{
    initCheckStatus: CheckSendingStatusMethodPod
}>

export type CheckSendingStatusState =
    | Readonly<{ type: "initial-check-status" }>
    | CheckSendingStatusEvent

export const initialCheckSendingStatusState: CheckSendingStatusState = {
    type: "initial-check-status",
}
