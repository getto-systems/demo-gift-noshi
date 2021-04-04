import { PreviewAction } from "./resource"

import { PreviewCoreAction } from "./core/action"
import { PreviewSlipsAction } from "./slips/action"

export function initPreviewAction(
    core: PreviewCoreAction,
    slips: PreviewSlipsAction,
): PreviewAction {
    return {
        core,
        slips,
        terminate: () => {
            core.terminate()
            slips.terminate()
        },
    }
}
