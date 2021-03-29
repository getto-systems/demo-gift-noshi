import { loadSeason } from "../../load_season/impl/core"

import { LoadSeasonInfra } from "../../load_season/infra"

import { LoadSeasonCoreAction } from "./action"

export function initLoadSeasonCoreAction(infra: LoadSeasonInfra): LoadSeasonCoreAction {
    return {
        load: loadSeason(infra),
    }
}
