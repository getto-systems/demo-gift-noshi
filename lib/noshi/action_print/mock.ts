import { mockBaseResource } from "../action_base/mock"
import { mockPreviewResource } from "../action_preview/mock"

import { PrintResource } from "./resource"

export function mockPrintResource(url: URL): PrintResource {
    return { ...mockBaseResource(), ...mockPreviewResource(url) }
}
