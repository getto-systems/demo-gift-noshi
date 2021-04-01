import { ApplicationStateAction } from "../../../z_vendor/getto-application/action/action"

import { LoadDeliverySlipsMethod } from "../../load_slips/method"

import { LoadDeliverySlipsEvent } from "../../load_slips/event"
import { NextDeliverySlip } from "../../load_slips/data"

export interface PreviewSlipsAction extends ApplicationStateAction<PreviewSlipsState> {
    nextSlipHref(): NextDeliverySlip<string>
}

export type PreviewSlipsMaterial = Readonly<{
    load: LoadDeliverySlipsMethod
}>

export type PreviewSlipsState = Readonly<{ type: "initial-slips" }> | LoadDeliverySlipsEvent

export const initialPreviewSlipsState: PreviewSlipsState = { type: "initial-slips" }
