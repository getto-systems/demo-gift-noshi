import { setupSyncActionTestRunner } from "../../../z_vendor/getto-application/action/test_helper"

import { markBoardValue } from "../../../z_vendor/getto-application/board/kernel/mock"
import { mockBoardValueStore } from "../../../z_vendor/getto-application/board/action_input/mock"

import { initInputNoshiNameAction } from "./core/impl"
import { noshiNameBoardConverter } from "../converter"
import { toBoardValue } from "../../../z_vendor/getto-application/board/kernel/converter"

describe("InputNoshiName", () => {
    test("reset", () => {
        const { action } = standard()

        action.board.input.set(markBoardValue("valid"))
        action.reset()

        expect(action.board.input.get()).toEqual("initial")
    })

    test("terminate", () =>
        new Promise<void>((done) => {
            const { action } = standard()

            const runner = setupSyncActionTestRunner([
                {
                    statement: () => {
                        action.terminate()
                        action.board.input.set(markBoardValue("valid"))
                    },
                    examine: (stack) => {
                        // no input/validate event after terminate
                        expect(stack).toEqual([])
                    },
                },
            ])

            const handler = runner(done)
            action.board.input.subscribeInputEvent(() => handler(action.board.input.get()))
        }))
})

function standard() {
    const action = initInputNoshiNameAction(() => noshiNameBoardConverter(toBoardValue("initial")))
    action.board.input.storeLinker.link(mockBoardValueStore())

    return { action }
}
