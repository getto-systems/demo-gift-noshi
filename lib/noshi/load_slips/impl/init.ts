import { newLocationDetecter } from "../../../z_vendor/getto-application/location/init"

import { newDeliverySlips } from "../../slip/init"

import { detectDeliverySlipNumber } from "./core"

import { LoadDeliverySlipsInfra } from "../infra"

import { LoadDeliverySlipsLocationDetecter } from "../method"

export function newLoadDeliverySlipsLocationDetecter(
    currentLocation: Location,
): LoadDeliverySlipsLocationDetecter {
    return newLocationDetecter(currentLocation, detectDeliverySlipNumber())
}

export function newLoadDeliverySlipsInfra(): LoadDeliverySlipsInfra {
    return {
        slips: newDeliverySlips(),
    }
}
