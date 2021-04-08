import { newClock } from "../../../../z_vendor/getto-application/infra/clock/init"
import { newSeasonRepositoryPod } from "../infra/repository/season"

import { LoadSeasonInfra } from "../infra"
import { RepositoryOutsideFeature } from "../../../../z_vendor/getto-application/infra/repository/infra"

export function newLoadSeasonInfra(feature: RepositoryOutsideFeature): LoadSeasonInfra {
    return {
        season: newSeasonRepositoryPod(feature),
        clock: newClock(),
    }
}
