import { defaultSeason, seasonRepositoryConverter } from "./converter"

import { LoadSeasonInfra } from "../infra"

import { LoadSeasonMethod } from "../method"
import { LoadSeasonEvent } from "../event"

interface Load {
    (infra: LoadSeasonInfra): LoadSeasonMethod
}
export const loadSeason: Load = (infra) => async (post) => {
    const { clock } = infra
    const season = infra.season(seasonRepositoryConverter)

    const result = await season.get()
    if (!result.success) {
        post({ type: "failed-to-load", err: result.err })
        return
    }
    if (!result.found) {
        post({ type: "succeed-to-load", value: defaultSeason(clock) })
        return
    }
    post({ type: "succeed-to-load", value: result.value })
}

export function loadSeasonEventHasDone(_event: LoadSeasonEvent): boolean {
    return true
}
