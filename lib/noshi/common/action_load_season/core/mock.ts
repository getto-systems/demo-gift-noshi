import { ApplicationMockStateAction } from "../../../../z_vendor/getto-application/action/mock"

import { initialLoadSeasonCoreState, LoadSeasonCoreAction, LoadSeasonCoreState } from "./action"

export function mockLoadSeasonCoreAction(): LoadSeasonCoreAction {
    return new Action()
}

class Action extends ApplicationMockStateAction<LoadSeasonCoreState> {
    initialState = initialLoadSeasonCoreState
}
