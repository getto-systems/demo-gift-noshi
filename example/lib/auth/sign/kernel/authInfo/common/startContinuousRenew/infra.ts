import { AuthzRepositoryPod } from "../../../../../../common/authz/infra"
import { Clock } from "../../../../../../z_vendor/getto-application/infra/clock/infra"
import { DelayTime, IntervalTime } from "../../../../../../z_vendor/getto-application/infra/config/infra"
import { LastAuthRepositoryPod, RenewRemotePod } from "../../kernel/infra"

export type StartContinuousRenewInfra = Readonly<{
    authz: AuthzRepositoryPod
    lastAuth: LastAuthRepositoryPod
    renew: RenewRemotePod
    clock: Clock
    config: Readonly<{
        interval: IntervalTime
        delay: DelayTime // TODO delay 表示を出すまでの待ち時間、って感じの名前にしたい
    }>
}>