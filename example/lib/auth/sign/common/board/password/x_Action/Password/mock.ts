import { initMockInputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/input/Action/impl"

import {
    CheckPasswordCharacterAction,
    PasswordBoardFieldAction,
    ValidatePasswordAction,
    ValidatePasswordState,
} from "./action"

import {
    BoardConvertResult,
    BoardValue,
} from "../../../../../../../z_vendor/getto-application/board/kernel/data"
import { Password } from "../../../../password/data"
import { PasswordCharacterState } from "./data"
import { ApplicationMockStateAction } from "../../../../../../../z_vendor/getto-application/action/impl"

export function initMockPasswordBoardFieldAction(
    password: BoardValue,
    characterState: PasswordCharacterState,
): PasswordBoardFieldAction {
    return {
        resource: initMockInputBoardValueResource("password", password),
        validate: new Action(),
        clear: () => null,
        passwordCharacter: new CheckAction(characterState),
        terminate: () => null,
    }
}

class Action
    extends ApplicationMockStateAction<ValidatePasswordState>
    implements ValidatePasswordAction {
    readonly initialState: ValidatePasswordState = { valid: true }
    readonly name = "password"

    get(): BoardConvertResult<Password> {
        return { success: false }
    }
    check() {
        // mock では特に何もしない
    }
}

class CheckAction implements CheckPasswordCharacterAction {
    state: PasswordCharacterState

    constructor(state: PasswordCharacterState) {
        this.state = state
    }

    check(): PasswordCharacterState {
        return this.state
    }
}
