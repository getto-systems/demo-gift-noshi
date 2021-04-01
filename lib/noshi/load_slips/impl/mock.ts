import { mockLocationDetecter } from "../../../z_vendor/getto-application/location/mock"

import { detectDeliverySlipNumber } from "./core"

import { LoadDeliverySlipsLocationDetecter } from "../method"

export function mockLoadDeliverySlipsLocationDetecter(
    currentURL: URL,
): LoadDeliverySlipsLocationDetecter {
    return mockLocationDetecter(currentURL, detectDeliverySlipNumber())
}
