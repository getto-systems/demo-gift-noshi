import { env } from "../../../../../y_environment/env"

import { wrapRepository } from "../../../../../z_vendor/getto-application/infra/repository/helper"
import { newDB_Season } from "../../../../../z_external/db/example/season"

import { SeasonRepositoryPod } from "../../infra"

export function newSeasonRepository(webStorage: Storage): SeasonRepositoryPod {
    return wrapRepository(newDB_Season(webStorage, env.storageKey.season))
}
