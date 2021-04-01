import { ApplicationMockStateAction } from "../../../z_vendor/getto-application/action/mock"

import { initialPreviewSlipsState, PreviewSlipsAction, PreviewSlipsState } from "./action"

import { NextDeliverySlip } from "../../load_slips/data"

export function mockLoadMenuCoreAction(): PreviewSlipsAction {
    return new Action()
}

class Action extends ApplicationMockStateAction<PreviewSlipsState> implements PreviewSlipsAction {
    readonly initialState = initialPreviewSlipsState

    nextSlipHref(): NextDeliverySlip<string> {
        return { hasNext: false }
    }
}
