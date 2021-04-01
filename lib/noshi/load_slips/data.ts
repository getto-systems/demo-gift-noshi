import { NoshiName } from "../name/data"

export type DeliverySlip = Readonly<{
    data: DeliverySlipData
    printState: DeliverySlipPrintState
}>
export type DeliverySlipPrintState = "done" | "working" | "waiting"

export type DeliverySlipData = Readonly<{
    number: DeliverySlipNumber
    type: DeliverySlipType
    size: DeliverySlipSize
    name: NoshiName
}>

export type DeliverySlipNumber = string & { DeliverySlipNumber: never }
export type DeliverySlipType = "御歳暮" | "内祝"
export type DeliverySlipSize = "A3" | "A4"

export type NextDeliverySlip<T> =
    | Readonly<{ hasNext: false }>
    | Readonly<{ hasNext: true; next: T }>

export type LoadCurrentDeliverySlipError =
    | Readonly<{ type: "empty" }>
    | Readonly<{ type: "not-found" }>
