import { newLoadDeliverySlipsInfra } from "../../load_slips/impl/init"

import { newDeliverySlipSheet } from "../infra/sheet/slips"

import { PrintDeliverySlipsInfra } from "../infra"

export function newPrintDeliverySlipsInfra(): PrintDeliverySlipsInfra {
    return {
        ...newLoadDeliverySlipsInfra(),
        sheet: newDeliverySlipSheet(),
    }
}
