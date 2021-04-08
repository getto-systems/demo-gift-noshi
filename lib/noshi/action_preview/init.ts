import {
    newLoadDeliverySlipsInfra,
    newLoadDeliverySlipsLocationDetecter,
} from "../load_slips/impl/init"

import { initPreviewAction } from "./impl"
import { initPreviewSlipsAction, initPreviewSlipsMaterial } from "./slips/impl"

import { PreviewResource } from "./resource"
import { initPreviewCoreAction, initPreviewCoreMaterial } from "./core/impl"
import { newPrintDeliverySlipsInfra } from "../print_slips/impl/init"
import { LocationOutsideFeature } from "../../z_vendor/getto-application/location/infra"

export function newPreviewResource(feature: LocationOutsideFeature): PreviewResource {
    const detecter = newLoadDeliverySlipsLocationDetecter(feature)
    return {
        preview: initPreviewAction(
            initPreviewCoreAction(initPreviewCoreMaterial(newPrintDeliverySlipsInfra(), detecter)),
            initPreviewSlipsAction(initPreviewSlipsMaterial(newLoadDeliverySlipsInfra(), detecter)),
        ),
    }
}
