import { toBoardValue } from "../../../z_vendor/getto-application/board/kernel/converter"
import { initInputNoshiNameAction } from "../../name/action_input/core/impl"
import { noshiNameBoardConverter } from "../../name/converter"
import { PreviewFormAction } from "./action"

export function mockAuthenticatePasswordFormAction(): PreviewFormAction {
    return {
        noshiName: initInputNoshiNameAction(() => noshiNameBoardConverter(toBoardValue("name"))),
        reset: () => null,
        terminate: () => null,
    }
}
