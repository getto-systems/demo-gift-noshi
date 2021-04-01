import { newLoadDeliverySlipsInfra } from "../load_slips/impl/init"

import { mockLoadDeliverySlipsLocationDetecter } from "../load_slips/impl/mock"

import { initPreviewAction } from "./impl"
import { initPreviewSlipsAction, initPreviewSlipsMaterial } from "./slips/impl"

import { PreviewResource } from "./resource"
import { initPreviewCoreAction, initPreviewCoreMaterial } from "./core/impl"

export function mockPreviewResource(url: URL): PreviewResource {
    const infra = newLoadDeliverySlipsInfra()
    const detecter = mockLoadDeliverySlipsLocationDetecter(url)
    return {
        preview: initPreviewAction(
            initPreviewCoreAction(initPreviewCoreMaterial(infra, detecter)),
            initPreviewSlipsAction(initPreviewSlipsMaterial(infra, detecter)),
        ),
    }
}
