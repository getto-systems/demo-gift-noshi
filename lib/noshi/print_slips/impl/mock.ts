import { newLoadDeliverySlipsInfra } from "../../load_slips/impl/init"

import { PrintDeliverySlipsInfra } from "../infra"

export function mockPrintDeliverySlipsInfra(): PrintDeliverySlipsInfra {
    return {
        ...newLoadDeliverySlipsInfra(),
        sheet: async () => ({ success: true, href: "#object-url" }),
    }
}
