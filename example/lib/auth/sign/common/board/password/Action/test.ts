import { initSyncActionTestRunner } from "../../../../../../z_vendor/getto-application/action/testHelper"
import { standardBoardValueStore } from "../../../../../../z_vendor/getto-application/board/input/Action/testHelper"

import { initValidateBoardInfra } from "../../../../../../z_vendor/getto-application/board/kernel/impl"

import { initInputPasswordAction } from "./Core/impl"

import { markBoardValue } from "../../../../../../z_vendor/getto-application/board/kernel/data"

describe("InputPassword", () => {
    test("validate; valid input", (done) => {
        const { resource: action } = standardElements()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // valid input
                    action.resource.input.set(markBoardValue("valid"))
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ valid: true }])
                    expect(action.validate.get()).toEqual({ valid: true, value: "valid" })
                },
            },
        ])

        action.validate.subscriber.subscribe(runner(done))
    })

    test("validate; invalid : empty", (done) => {
        const { resource: action } = standardElements()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // empty
                    action.resource.input.set(markBoardValue(""))
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ valid: false, err: ["empty"] }])
                    expect(action.validate.get()).toEqual({ valid: false, err: ["empty"] })
                },
            },
        ])

        action.validate.subscriber.subscribe(runner(done))
    })

    test("validate; invalid : too-long", (done) => {
        const { resource: action } = standardElements()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // too-long
                    action.resource.input.set(markBoardValue("a".repeat(72 + 1)))
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ valid: false, err: ["too-long"] }])
                    expect(action.validate.get()).toEqual({ valid: false, err: ["too-long"] })
                },
            },
        ])

        action.validate.subscriber.subscribe(runner(done))
    })

    test("validate; valid : just max-length", (done) => {
        const { resource: action } = standardElements()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // just max-length
                    action.resource.input.set(markBoardValue("a".repeat(72)))
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ valid: true }])
                    expect(action.validate.get()).toEqual({ valid: true, value: "a".repeat(72) })
                },
            },
        ])

        action.validate.subscriber.subscribe(runner(done))
    })

    test("validate; invalid : too-long : multi-byte", (done) => {
        const { resource: action } = standardElements()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // too-long : "あ"(UTF8) is 3 bytes character
                    action.resource.input.set(markBoardValue("あ".repeat(24) + "a"))
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ valid: false, err: ["too-long"] }])
                    expect(action.validate.get()).toEqual({ valid: false, err: ["too-long"] })
                },
            },
        ])

        action.validate.subscriber.subscribe(runner(done))
    })

    test("validate; valid : just max-length : multi-byte", (done) => {
        const { resource: action } = standardElements()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    // just max-length : "あ"(UTF8) is 3 bytes character
                    action.resource.input.set(markBoardValue("あ".repeat(24)))
                },
                examine: (stack) => {
                    expect(stack).toEqual([{ valid: true }])
                    expect(action.validate.get()).toEqual({ valid: true, value: "あ".repeat(24) })
                },
            },
        ])

        action.validate.subscriber.subscribe(runner(done))
    })

    test("password character state : single byte", () => {
        const { resource: action } = standardElements()

        action.resource.input.set(markBoardValue("password"))

        expect(action.checkCharacter()).toEqual({ multiByte: false })
    })

    test("password character state : multi byte", () => {
        const { resource: action } = standardElements()

        action.resource.input.set(markBoardValue("パスワード"))
        expect(action.checkCharacter()).toEqual({ multiByte: true })
    })

    test("clear", () => {
        const { resource: action } = standardElements()

        action.resource.input.set(markBoardValue("valid"))
        action.clear()

        expect(action.resource.input.get()).toEqual("")
    })

    test("terminate", (done) => {
        const { resource: action } = standardElements()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    action.terminate()
                    action.resource.input.set(markBoardValue("valid"))
                },
                examine: (stack) => {
                    // no input/validate event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        const handler = runner(done)
        action.resource.input.subscribeInputEvent(() => handler(action.resource.input.get()))
        action.validate.subscriber.subscribe(handler)
    })
})

function standardElements() {
    const resource = initInputPasswordAction(initValidateBoardInfra())
    resource.resource.input.storeLinker.link(standardBoardValueStore())

    return { resource }
}
