import { initBaseView } from "../action_base/impl"

import { PrintView, PrintResource } from "./resource"

export function initPrintView(resource: PrintResource): PrintView {
    return initBaseView(resource, () => {
        resource.preview.terminate()
    })
}
