import { ApplicationAction } from "../../../../../../../z_vendor/getto-application/action/action"
import { ValidateBoardAction } from "../../../../../../../z_vendor/getto-application/board/validateBoard/x_Action/ValidateBoard/action"
import { LoginIDBoardFieldAction } from "../../../../../common/board/loginID/x_Action/LoginID/action"
import { PasswordBoardFieldAction } from "../../../../../common/board/password/x_Action/Password/action"

import { AuthenticateFields } from "../../../data"

export interface FormAction extends ApplicationAction {
    readonly loginID: LoginIDBoardFieldAction
    readonly password: PasswordBoardFieldAction
    readonly validate: ValidateAuthenticateAction
    readonly clear: ClearAction
}

export type ValidateAuthenticateAction = ValidateBoardAction<AuthenticateFields>

interface ClearAction {
    (): void
}
