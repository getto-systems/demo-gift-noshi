import { mockLoadDeliverySlipsLocationDetecter } from "../load_slips/impl/mock"
import { mockPrintDeliverySlipsInfra } from "../print_slips/impl/mock"

import { newLoadDeliverySlipsInfra } from "../load_slips/impl/init"

import { initPreviewAction } from "./impl"
import { initPreviewCoreAction, initPreviewCoreMaterial } from "./core/impl"
import { initPreviewSlipsAction, initPreviewSlipsMaterial } from "./slips/impl"

import { PreviewResource } from "./resource"

export function mockPreviewResource(url: URL): PreviewResource {
    const detecter = mockLoadDeliverySlipsLocationDetecter(url)
    return {
        preview: initPreviewAction(
            initPreviewCoreAction(initPreviewCoreMaterial(mockPrintDeliverySlipsInfra(), detecter)),
            initPreviewSlipsAction(initPreviewSlipsMaterial(newLoadDeliverySlipsInfra(), detecter)),
        ),
    }
}
