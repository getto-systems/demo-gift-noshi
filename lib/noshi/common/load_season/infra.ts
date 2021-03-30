import { Clock } from "../../../z_vendor/getto-application/infra/clock/infra"
import { RepositoryPod } from "../../../z_vendor/getto-application/infra/repository/infra"

import { Season, SeasonPeriod } from "./data"

export type LoadSeasonInfra = Readonly<{
    season: SeasonRepositoryPod
    clock: Clock
}>

export type SeasonRepositoryPod = RepositoryPod<Season, SeasonRepositoryValue>
export type SeasonRepositoryValue = Readonly<{
    year: number
    period: SeasonPeriod
}>
