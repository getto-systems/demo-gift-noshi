import { initMockLoginIDBoardFieldAction } from "../../../../../../common/board/loginID/x_Action/LoginID/mock"
import { initMockPasswordBoardFieldAction } from "../../../../../../common/board/password/x_Action/Password/mock"
import { initMockValidateBoardAction } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/mock"

import { FormAction } from "./action"

import { emptyBoardValue } from "../../../../../../../../z_getto/board/kernel/data"

export function initMockFormAction(): FormAction {
    return {
        loginID: initMockLoginIDBoardFieldAction(),
        password: initMockPasswordBoardFieldAction(emptyBoardValue, { multiByte: false }),
        validate: initMockValidateBoardAction(),
        clear: () => null,
        terminate: () => null,
    }
}