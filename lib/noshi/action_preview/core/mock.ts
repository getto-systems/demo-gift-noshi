import { ApplicationMockStateAction } from "../../../z_vendor/getto-application/action/mock"

import { initialPreviewCoreState, PreviewCoreAction, PreviewCoreState } from "./action"

export function mockLoadMenuCoreAction(): PreviewCoreAction {
    return new Action()
}

class Action extends ApplicationMockStateAction<PreviewCoreState> implements PreviewCoreAction {
    readonly initialState = initialPreviewCoreState

    async print(): Promise<PreviewCoreState> {
        return this.initialState
    }
}
