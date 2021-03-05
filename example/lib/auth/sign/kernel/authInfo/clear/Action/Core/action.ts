import { ApplicationStateAction } from "../../../../../../../z_vendor/getto-application/action/action"

import { ClearAuthInfoMethod } from "../../method"

import { ClearAuthInfoEvent } from "../../event"

export interface LogoutCoreAction extends ApplicationStateAction<LogoutCoreState> {
    submit(): void
}

export type LogoutCoreMaterial = Readonly<{
    clear: ClearAuthInfoMethod
}>

export type LogoutCoreState = Readonly<{ type: "initial-logout" }> | ClearAuthInfoEvent

export const initialLogoutCoreState: LogoutCoreState = { type: "initial-logout" }
