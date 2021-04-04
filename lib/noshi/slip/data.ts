import { NoshiName } from "../name/data"

export type DeliverySlip = Readonly<{
    data: DeliverySlipData
    printState: DeliverySlipPrintState
    href: string
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
