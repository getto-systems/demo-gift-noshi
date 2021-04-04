import { ApplicationStateAction } from "../../../z_vendor/getto-application/action/action"

import { LoadCurrentDeliverySlipMethod } from "../../load_slips/method"
import { PrintDeliverySlipsMethod } from "../../print_slips/method"

import { LoadCurrentDeliverySlipEvent } from "../../load_slips/event"
import { PrintDeliverySlipsEvent } from "../../print_slips/event"

export interface PreviewCoreAction extends ApplicationStateAction<PreviewCoreState> {
    print(): void
}

export type PreviewCoreMaterial = Readonly<{
    load: LoadCurrentDeliverySlipMethod
    print: PrintDeliverySlipsMethod
}>

export type PreviewCoreState =
    | Readonly<{ type: "initial-preview" }>
    | LoadCurrentDeliverySlipEvent
    | PrintDeliverySlipsEvent

export const initialPreviewCoreState: PreviewCoreState = { type: "initial-preview" }
