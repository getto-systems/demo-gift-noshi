import { initSyncActionChecker } from "../../../../getto-example/Application/testHelper"

import { newBoard } from "../../../kernel/infra/board"

import { initInputBoardValueAction } from "./impl"

import { InputBoardValueState } from "./action"

import { markBoardValue } from "../../../kernel/data"

describe("InputBoardValue", () => {
    test("input and clear", () => {
        const { action } = standardResource()

        const checker = initSyncActionChecker<InputBoardValueState>()
        action.addStateHandler(checker.handler)

        action.set(markBoardValue("input"))
        checker.check((stack) => {
            expect(stack).toEqual(["input"])
            expect(action.get()).toEqual("input")
        })

        action.clear()
        checker.check((stack) => {
            expect(stack).toEqual([""])
            expect(action.get()).toEqual("")
        })
    })
})

function standardResource() {
    const board = newBoard()

    const action = initInputBoardValueAction({ name: "input", type: "text" }, { board })

    return { board, action }
}
