import { Remote, RemoteResult, RemoteSimulator } from "../../../../../z_vendor/getto-application/remote/infra"
import { StoreResult } from "../../../../../z_vendor/getto-application/storage/infra"

import { StorageError } from "../../../../../z_vendor/getto-application/storage/data"
import { ApiCredential } from "../../../../../common/apiCredential/data"
import { AuthnInfo, LastAuth, RenewRemoteError, AuthnNonce } from "./data"

export interface AuthnInfoRepository {
    load(): LoadLastAuthResult
    store(authnInfo: AuthnInfo): StoreResult
    remove(): StoreResult
}

export type LoadLastAuthResult =
    | Readonly<{ success: true; found: true; lastAuth: LastAuth }>
    | Readonly<{ success: true; found: false }>
    | Readonly<{ success: false; err: StorageError }>

export type RenewRemote = Remote<AuthnNonce, RenewResponse, RenewRemoteError>
export type RenewResult = RemoteResult<RenewResponse, RenewRemoteError>
export type RenewSimulator = RemoteSimulator<AuthnNonce, RenewResponse, RenewRemoteError>
export type RenewResponse = Readonly<{
    auth: AuthnInfo
    api: ApiCredential
}>
