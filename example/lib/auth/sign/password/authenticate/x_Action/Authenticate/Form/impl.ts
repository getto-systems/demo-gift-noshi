import { initLoginIDBoardFieldAction } from "../../../../../../common/board/loginID/x_Action/LoginID/impl"
import { initPasswordBoardFieldAction } from "../../../../../../common/board/password/x_Action/Password/impl"

import { initValidateBoardAction } from "../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/impl"

import { ValidateBoardInfra } from "../../../../../../../z_getto/board/validateBoard/infra"
import { ValidateBoardFieldInfra } from "../../../../../../../z_getto/board/validateField/infra"

import { AuthenticatePasswordFormAction } from "./action"
import { BoardConvertResult } from "../../../../../../../z_getto/board/kernel/data"
import { AuthenticatePasswordFields } from "../../../data"

export type AuthenticatePasswordFormBase = ValidateBoardInfra & ValidateBoardFieldInfra

export function initAuthenticatePasswordFormAction(
    infra: AuthenticatePasswordFormBase,
): AuthenticatePasswordFormAction {
    const loginID = initLoginIDBoardFieldAction({ name: "loginID" }, infra)
    const password = initPasswordBoardFieldAction({ name: "password" }, infra)

    const validate = initValidateBoardAction(
        {
            fields: [loginID.validate.name, password.validate.name],
            converter,
        },
        infra,
    )

    loginID.input.addInputHandler(() => validate.check())
    password.input.addInputHandler(() => validate.check())

    return {
        loginID,
        password,
        validate,
        clear: () => {
            loginID.clear()
            password.clear()
        },
        terminate: () => {
            loginID.terminate()
            password.terminate()
            validate.terminate()
        },
    }

    function converter(): BoardConvertResult<AuthenticatePasswordFields> {
        loginID.validate.check()
        password.validate.check()

        const loginIDResult = loginID.validate.get()
        const passwordResult = password.validate.get()
        if (!loginIDResult.success || !passwordResult.success) {
            return { success: false }
        }
        return {
            success: true,
            value: {
                loginID: loginIDResult.value,
                password: passwordResult.value,
            },
        }
    }
}
