import { ApiCredentialRepository } from "../../../../../../common/apiCredential/infra"
import { Clock } from "../../../../../../z_getto/infra/clock/infra"
import { DelayTime, IntervalTime } from "../../../../../../z_getto/infra/config/infra"
import { AuthnInfoRepository, RenewAuthnInfoRemote } from "../../kernel/infra"

export type StartContinuousRenewAuthnInfoInfra = Readonly<{
    apiCredentials: ApiCredentialRepository
    authnInfos: AuthnInfoRepository
    renew: RenewAuthnInfoRemote
    clock: Clock
    config: Readonly<{
        interval: IntervalTime
        delay: DelayTime // TODO delay 表示を出すまでの待ち時間、って感じの名前にしたい
    }>
}>
