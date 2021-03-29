import { defaultSeason, seasonRepositoryConverter } from "./converter"

import { LoadSeasonInfra } from "../infra"

import { LoadSeasonMethod } from "../method"

interface Load {
    (infra: LoadSeasonInfra): LoadSeasonMethod
}
export const loadSeason: Load = (infra) => () => {
    const { clock } = infra
    const season = infra.season(seasonRepositoryConverter)

    const result = season.get()
    if (!result.success) {
        return result
    }
    if (!result.found) {
        return { success: true, value: defaultSeason(clock) }
    }
    return { success: true, value: result.value }
}
