import { mockInputBoardValueResource } from "../../../../z_vendor/getto-application/board/action_input/mock"

import { InputNoshiNameAction } from "./action"

import { emptyBoardValue } from "../../../../z_vendor/getto-application/board/kernel/data"

export function mockInputLoginIDAction(): InputNoshiNameAction {
    return {
        board: mockInputBoardValueResource("text", emptyBoardValue),
        reset: () => null,
        terminate: () => null,
    }
}
