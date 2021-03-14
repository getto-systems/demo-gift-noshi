import { AuthzRepositoryPod } from "../../kernel/infra"
import { Clock } from "../../../../../../z_vendor/getto-application/infra/clock/infra"
import {
    ExpireTime,
    IntervalTime,
} from "../../../../../../z_vendor/getto-application/infra/config/infra"
import { AuthnRepositoryPod, RenewAuthInfoRemotePod } from "../../kernel/infra"

export type StartContinuousRenewInfra = Readonly<{
    authn: AuthnRepositoryPod
    authz: AuthzRepositoryPod
    renew: RenewAuthInfoRemotePod
    clock: Clock
    config: Readonly<{
        interval: IntervalTime
        authnExpire: ExpireTime
    }>
}>
