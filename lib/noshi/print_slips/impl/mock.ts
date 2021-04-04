import { newLoadDeliverySlipsInfra } from "../../load_slips/impl/init"

import { PrintDeliverySlipsInfra } from "../infra"

export function mockPrintDeliverySlipsInfra(): PrintDeliverySlipsInfra {
    return {
        ...newLoadDeliverySlipsInfra(),
        sheet: async () => "#object-url",
    }
}
