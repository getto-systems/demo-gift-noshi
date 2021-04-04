import { newSheet_deliverySlips } from "../../../../z_external/sheet/slips"

import { DeliverySlipSheet } from "../../infra"

export function newDeliverySlipSheet(): DeliverySlipSheet {
    const sheet = newSheet_deliverySlips()
    return async (slips) => {
        try {
            const href = await sheet(slips)
            return { success: true, href }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
}
