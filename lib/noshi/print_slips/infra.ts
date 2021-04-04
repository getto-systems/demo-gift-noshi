import { DeliverySlipData } from "../slip/data"

export type PrintDeliverySlipsInfra = Readonly<{
    slips: DeliverySlipData[]
    sheet: DeliverySlipSheet
}>

export interface DeliverySlipSheet {
    (slips: DeliverySlipData[]): Promise<string>
}
