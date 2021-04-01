import {
    newLoadDeliverySlipsInfra,
    newLoadDeliverySlipsLocationDetecter,
} from "../load_slips/impl/init"

import { initPreviewAction } from "./impl"
import { initPreviewSlipsAction, initPreviewSlipsMaterial } from "./slips/impl"

import { PreviewResource } from "./resource"

type OutsideFeature = Readonly<{
    currentLocation: Location
}>
export function newPreviewResource(feature: OutsideFeature): PreviewResource {
    const { currentLocation } = feature
    return {
        preview: initPreviewAction(
            initPreviewSlipsAction(
                initPreviewSlipsMaterial(
                    newLoadDeliverySlipsInfra(),
                    newLoadDeliverySlipsLocationDetecter(currentLocation),
                ),
            ),
        ),
    }
}
