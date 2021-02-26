import { ApplicationAction } from "../../../../../../../z_vendor/getto-application/action/action"
import { ValidateBoardAction } from "../../../../../../../z_vendor/getto-application/board/validateBoard/x_Action/ValidateBoard/action"
import { InputLoginIDAction } from "../../../../../common/board/loginID/Action/Core/action"
import { InputPasswordAction } from "../../../../../common/board/password/Action/Core/action"

import { AuthenticateFields } from "../../../data"

export interface FormAction extends ApplicationAction {
    readonly loginID: InputLoginIDAction
    readonly password: InputPasswordAction
    readonly validate: ValidateAuthenticateAction
    readonly clear: ClearAction
}

export type ValidateAuthenticateAction = ValidateBoardAction<AuthenticateFields>

interface ClearAction {
    (): void
}
