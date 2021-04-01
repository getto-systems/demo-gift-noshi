import { DeliverySlip } from "./data"

export type LoadDeliverySlipsEvent = Readonly<{ type: "succeed-to-load"; slips: DeliverySlip[] }>
