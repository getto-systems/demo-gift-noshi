import { Authz } from "../../../../common/authz/data"
import { Remote, RemoteResult, RemoteSimulator } from "../../../../z_vendor/getto-application/infra/remote/infra"
import { DelayTime } from "../../../../z_vendor/getto-application/infra/config/infra"

import { Authn } from "../../kernel/authn/kernel/data"

import { AuthenticateFields, AuthenticateRemoteError } from "./data"

export type AuthenticateInfra = Readonly<{
    authenticate: AuthenticateRemote
    config: Readonly<{
        delay: DelayTime
    }>
}>

export type AuthenticateRemote = Remote<
    AuthenticateFields,
    AuthenticateResponse,
    AuthenticateRemoteError
>
export type AuthenticateResult = RemoteResult<AuthenticateResponse, AuthenticateRemoteError>
export type AuthenticateSimulator = RemoteSimulator<
    AuthenticateFields,
    AuthenticateResponse,
    AuthenticateRemoteError
>
export type AuthenticateResponse = Readonly<{
    auth: Authn
    api: Authz
}>
