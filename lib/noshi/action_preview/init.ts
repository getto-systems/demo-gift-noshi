import {
    newLoadDeliverySlipsInfra,
    newLoadDeliverySlipsLocationDetecter,
} from "../load_slips/impl/init"

import { initPreviewAction } from "./impl"
import { initPreviewSlipsAction, initPreviewSlipsMaterial } from "./slips/impl"

import { PreviewResource } from "./resource"
import { initPreviewCoreAction, initPreviewCoreMaterial } from "./core/impl"

type OutsideFeature = Readonly<{
    currentLocation: Location
}>
export function newPreviewResource(feature: OutsideFeature): PreviewResource {
    const { currentLocation } = feature
    const infra = newLoadDeliverySlipsInfra()
    const detecter = newLoadDeliverySlipsLocationDetecter(currentLocation)
    return {
        preview: initPreviewAction(
            initPreviewCoreAction(initPreviewCoreMaterial(infra, detecter)),
            initPreviewSlipsAction(initPreviewSlipsMaterial(infra, detecter)),
        ),
    }
}
