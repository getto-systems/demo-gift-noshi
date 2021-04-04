import { ApplicationMockStateAction } from "../../../z_vendor/getto-application/action/mock"

import { initialPreviewSlipsState, PreviewSlipsAction, PreviewSlipsState } from "./action"

export function mockLoadMenuCoreAction(): PreviewSlipsAction {
    return new Action()
}

class Action extends ApplicationMockStateAction<PreviewSlipsState> implements PreviewSlipsAction {
    readonly initialState = initialPreviewSlipsState
}
