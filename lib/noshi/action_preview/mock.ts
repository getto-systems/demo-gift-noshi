import { newLoadDeliverySlipsInfra } from "../load_slips/impl/init"

import { mockLoadDeliverySlipsLocationDetecter } from "../load_slips/impl/mock"

import { initPreviewAction } from "./impl"
import { initPreviewSlipsAction, initPreviewSlipsMaterial } from "./slips/impl"

import { PreviewResource } from "./resource"

export function mockPreviewResource(url: URL): PreviewResource {
    return {
        preview: initPreviewAction(
            initPreviewSlipsAction(
                initPreviewSlipsMaterial(
                    newLoadDeliverySlipsInfra(),
                    mockLoadDeliverySlipsLocationDetecter(url),
                ),
            ),
        ),
    }
}
