import { toBoardValue } from "../../z_vendor/getto-application/board/kernel/converter"
import { noshiNameBoardConverter } from "../name/converter"
import { PreviewCoreAction } from "./core/action"
import { initPreviewFormAction } from "./form/impl"
import { PreviewAction } from "./resource"

import { PreviewSlipsAction } from "./slips/action"

export function initPreviewAction(
    core: PreviewCoreAction,
    slips: PreviewSlipsAction,
): PreviewAction {
    // TODO provider をちゃんとする
    const form = initPreviewFormAction(() => noshiNameBoardConverter(toBoardValue("")))

    // TODO input で core を再描画する
    // TODO core load 時に input の中身を埋める(reset か？)

    return {
        core,
        form,
        slips,
        terminate: () => {
            core.terminate()
            form.terminate()
            slips.terminate()
        },
    }
}
