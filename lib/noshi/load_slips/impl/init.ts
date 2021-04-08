import { newLocationDetecter } from "../../../z_vendor/getto-application/location/init"

import { newDeliverySlips } from "../../slip/init"

import { detectDeliverySlipNumber } from "./core"

import { LoadDeliverySlipsInfra } from "../infra"

import { LoadDeliverySlipsLocationDetecter } from "../method"
import { LocationOutsideFeature } from "../../../z_vendor/getto-application/location/infra"

export function newLoadDeliverySlipsLocationDetecter(
    feature: LocationOutsideFeature,
): LoadDeliverySlipsLocationDetecter {
    return newLocationDetecter(feature, detectDeliverySlipNumber())
}

export function newLoadDeliverySlipsInfra(): LoadDeliverySlipsInfra {
    return {
        slips: newDeliverySlips(),
    }
}
