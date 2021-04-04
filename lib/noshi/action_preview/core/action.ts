import { ApplicationStateAction } from "../../../z_vendor/getto-application/action/action"

import { LoadCurrentDeliverySlipMethod } from "../../load_slips/method"

import { LoadCurrentDeliverySlipEvent } from "../../load_slips/event"

export interface PreviewCoreAction extends ApplicationStateAction<PreviewCoreState> {
    print(): void
}

export type PreviewCoreMaterial = Readonly<{
    load: LoadCurrentDeliverySlipMethod
}>

export type PreviewCoreState =
    | Readonly<{ type: "initial-preview" }>
    | Readonly<{ type: "succeed-to-print"; href: string }>
    | LoadCurrentDeliverySlipEvent

export const initialPreviewCoreState: PreviewCoreState = { type: "initial-preview" }
