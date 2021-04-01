import { ApplicationAction } from "../../../../z_vendor/getto-application/action/action"
import { InputBoardValueResource } from "../../../../z_vendor/getto-application/board/action_input/action"

export interface InputNoshiNameAction extends ApplicationAction {
    readonly board: InputBoardValueResource
    readonly reset: ResetAction
}

interface ResetAction {
    (): void
}
