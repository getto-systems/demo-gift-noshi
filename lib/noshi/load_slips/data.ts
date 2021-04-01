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
export type DeliverySlipSize = "b4" | "a4"

export type NoshiName = string & { NoshiName: never }

export type NextDeliverySlip<T> =
    | Readonly<{ hasNext: false }>
    | Readonly<{ hasNext: true; next: T }>
