import { LoadSeasonCoreAction } from "./action"

import { LoadSeasonResult } from "../../load_season/data"

export function mockLoadSeasonCoreAction(result: LoadSeasonResult): LoadSeasonCoreAction {
    return {
        load: () => result,
    }
}
