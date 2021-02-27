import {
    Remote,
    RemoteError,
    RemoteResult,
    RemoteSimulator,
} from "../../z_vendor/getto-application/infra/remote/infra"

import { NotifyUnexpectedErrorPod } from "./action"

export type UnexpectedErrorInfra = UnexpectedNotifyInfra

export type UnexpectedNotifyInfra = Readonly<{
    notify: NotifyUnexpectedErrorRemoteAccess
}>

export interface NotifyUnexpectedError {
    (infra: UnexpectedNotifyInfra): NotifyUnexpectedErrorPod
}

export type NotifyUnexpectedErrorRemoteAccess = Remote<unknown, true, RemoteError>
export type NotifyUnexpectedErrorRemoteAccessResult = RemoteResult<true, RemoteError>
export type NotifyUnexpectedErrorSimulator = RemoteSimulator<unknown, true, RemoteError>
