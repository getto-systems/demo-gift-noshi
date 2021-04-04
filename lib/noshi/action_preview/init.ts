import {
    newLoadDeliverySlipsInfra,
    newLoadDeliverySlipsLocationDetecter,
} from "../load_slips/impl/init"

import { initPreviewAction } from "./impl"
import { initPreviewSlipsAction, initPreviewSlipsMaterial } from "./slips/impl"

import { PreviewResource } from "./resource"
import { initPreviewCoreAction, initPreviewCoreMaterial } from "./core/impl"
import { newPrintDeliverySlipsInfra } from "../print_slips/impl/init"

type OutsideFeature = Readonly<{
    currentLocation: Location
}>
export function newPreviewResource(feature: OutsideFeature): PreviewResource {
    const { currentLocation } = feature
    const detecter = newLoadDeliverySlipsLocationDetecter(currentLocation)
    return {
        preview: initPreviewAction(
            initPreviewCoreAction(initPreviewCoreMaterial(newPrintDeliverySlipsInfra(), detecter)),
            initPreviewSlipsAction(initPreviewSlipsMaterial(newLoadDeliverySlipsInfra(), detecter)),
        ),
    }
}
