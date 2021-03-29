import { newClock } from "../../../../z_vendor/getto-application/infra/clock/init"
import { newSeasonRepository } from "../infra/repository/season"

import { LoadSeasonInfra } from "../infra"

export function newLoadSeasonInfra(webStorage: Storage): LoadSeasonInfra {
    return {
        season: newSeasonRepository(webStorage),
        clock: newClock(),
    }
}
