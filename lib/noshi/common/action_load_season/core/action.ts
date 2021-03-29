import { LoadSeasonMethod } from "../../load_season/method"

import { LoadSeasonResult } from "../../load_season/data"

export interface LoadSeasonCoreAction {
    load(): LoadSeasonResult
}

export type LoadSeasonCoreMaterial = Readonly<{
    loadSeason: LoadSeasonMethod
}>
