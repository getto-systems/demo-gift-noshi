import { DeliverySlipData } from "../slip/data"
import { PrintDeliverySlipsError } from "./data"

export type PrintDeliverySlipsInfra = Readonly<{
    slips: DeliverySlipData[]
    sheet: DeliverySlipSheet
}>

export interface DeliverySlipSheet {
    (slips: DeliverySlipData[]): Promise<SheetResult>
}

type SheetResult =
    | Readonly<{ success: true; href: string }>
    | Readonly<{ success: false; err: PrintDeliverySlipsError }>
