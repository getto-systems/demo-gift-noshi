import { DeliverySlip, DeliverySlipData } from "../slip/data"
import { LoadCurrentDeliverySlipError, NextDeliverySlipHref } from "./data"

export type LoadDeliverySlipsEvent = Readonly<{ type: "succeed-to-load"; slips: DeliverySlip[] }>
export type LoadCurrentDeliverySlipEvent =
    | Readonly<{ type: "failed-to-load"; err: LoadCurrentDeliverySlipError }>
    | Readonly<{ type: "succeed-to-load"; slip: DeliverySlipData; next: NextDeliverySlipHref }>
