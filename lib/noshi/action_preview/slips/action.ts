import { ApplicationStateAction } from "../../../z_vendor/getto-application/action/action"

import { LoadDeliverySlipsMethod } from "../../load_slips/method"

import { LoadDeliverySlipsEvent } from "../../load_slips/event"

export type PreviewSlipsAction = ApplicationStateAction<PreviewSlipsState>

export type PreviewSlipsMaterial = Readonly<{
    load: LoadDeliverySlipsMethod
}>

export type PreviewSlipsState = Readonly<{ type: "initial-slips" }> | LoadDeliverySlipsEvent

export const initialPreviewSlipsState: PreviewSlipsState = { type: "initial-slips" }
