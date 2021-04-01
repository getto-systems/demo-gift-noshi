import { PreviewAction } from "./resource"

import { PreviewSlipsAction } from "./slips/action"

export function initPreviewAction(slips: PreviewSlipsAction): PreviewAction {
    return {
        slips,
        terminate: () => {
            slips.terminate()
        },
    }
}
