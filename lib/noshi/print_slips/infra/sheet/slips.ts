import { newSheet_deliverySlips } from "../../../../z_external/sheet/slips"

import { DeliverySlipSheet } from "../../infra"

export function newDeliverySlipSheet(): DeliverySlipSheet {
    return newSheet_deliverySlips()
}
