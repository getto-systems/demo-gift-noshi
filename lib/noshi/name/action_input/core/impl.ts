import { initInputBoardValueResource } from "../../../../z_vendor/getto-application/board/action_input/impl"

import { toBoardValue } from "../../../../z_vendor/getto-application/board/kernel/converter"

import { InputNoshiNameAction } from "./action"

import { NoshiName } from "../../data"

export function initInputNoshiNameAction(provider: Provider<NoshiName>): InputNoshiNameAction {
    const board = initInputBoardValueResource("text")

    return {
        board,
        reset: () => board.input.set(toBoardValue(provider())),
        terminate: () => {
            board.input.terminate()
        },
    }
}

interface Provider<T> {
    (): T
}
