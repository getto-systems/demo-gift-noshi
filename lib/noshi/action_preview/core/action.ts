import { ApplicationStateAction } from "../../../z_vendor/getto-application/action/action"

import { LoadCurrentDeliverySlipMethod } from "../../load_slips/method"

import { LoadCurrentDeliverySlipEvent } from "../../load_slips/event"

export type PreviewCoreAction = ApplicationStateAction<PreviewCoreState>

export type PreviewCoreMaterial = Readonly<{
    load: LoadCurrentDeliverySlipMethod
}>

export type PreviewCoreState = Readonly<{ type: "initial-preview" }> | LoadCurrentDeliverySlipEvent

export const initialPreviewCoreState: PreviewCoreState = { type: "initial-preview" }
