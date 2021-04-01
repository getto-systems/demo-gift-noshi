import { ApplicationAction } from "../../../z_vendor/getto-application/action/action"

import { InputNoshiNameAction } from "../../name/action_input/core/action"

export interface PreviewFormAction extends ApplicationAction {
    readonly noshiName: InputNoshiNameAction
    readonly reset: ResetAction
}

interface ResetAction {
    (): void
}
