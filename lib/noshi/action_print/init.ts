import { BaseOutsideFeature, newBaseResource } from "../action_base/init"

import { PrintView } from "./resource"
import { initPrintView } from "./impl"
import { newPreviewResource } from "../action_preview/init"

export function newPrintView(feature: BaseOutsideFeature): PrintView {
    return initPrintView({ ...newBaseResource(feature), ...newPreviewResource(feature) })
}
