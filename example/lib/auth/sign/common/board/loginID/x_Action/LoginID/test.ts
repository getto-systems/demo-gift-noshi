import {
    initSyncActionChecker_simple,
    initSyncActionTestRunner,
} from "../../../../../../../z_vendor/getto-application/action/testHelper"
import { standardBoardValueStore } from "../../../../../../../z_vendor/getto-application/board/input/x_Action/Input/testHelper"

import { newBoardValidateStack } from "../../../../../../../z_vendor/getto-application/board/kernel/infra/stack"

import { initLoginIDBoardFieldAction } from "./impl"

import { ValidateBoardFieldState } from "../../../../../../../z_vendor/getto-application/board/validateField/x_Action/ValidateField/action"

import { markBoardValue } from "../../../../../../../z_vendor/getto-application/board/kernel/data"
import { ValidateLoginIDError } from "./data"

describe("LoginIDBoard", () => {
    test("validate; valid input", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker_simple<
            ValidateBoardFieldState<ValidateLoginIDError>
        >()

        resource.validate.subscriber.subscribe(checker.handler)

        // valid input
        resource.input.set(markBoardValue("valid"))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: true }])
        })
        expect(resource.validate.get()).toEqual({ success: true, value: "valid" })
    })

    test("validate; invalid : empty", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker_simple<
            ValidateBoardFieldState<ValidateLoginIDError>
        >()

        resource.validate.subscriber.subscribe(checker.handler)

        // empty
        resource.input.set(markBoardValue(""))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: false, err: ["empty"] }])
        })
        expect(resource.validate.get()).toEqual({ success: false })
    })

    test("validate; invalid : too-long", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker_simple<
            ValidateBoardFieldState<ValidateLoginIDError>
        >()

        resource.validate.subscriber.subscribe(checker.handler)

        // too-long
        resource.input.set(markBoardValue("a".repeat(100 + 1)))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: false, err: ["too-long"] }])
        })
        expect(resource.validate.get()).toEqual({ success: false })
    })

    test("validate; valid : just max-length", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker_simple<
            ValidateBoardFieldState<ValidateLoginIDError>
        >()

        resource.validate.subscriber.subscribe(checker.handler)

        // just max-length
        resource.input.set(markBoardValue("a".repeat(100)))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: true }])
        })
        expect(resource.validate.get()).toEqual({ success: true, value: "a".repeat(100) })
    })

    test("clear", () => {
        const { resource } = standardResource()

        resource.input.set(markBoardValue("valid"))
        resource.clear()

        expect(resource.input.get()).toEqual("")
    })

    test("terminate", (done) => {
        const { resource } = standardResource()

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    resource.terminate()
                    resource.input.set(markBoardValue("valid"))
                },
                examine: (stack) => {
                    // no input/validate event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        const handler = runner(done)
        resource.input.subscribeInputEvent(() => handler(resource.input.get()))
        resource.validate.subscriber.subscribe(handler)
    })
})

function standardResource() {
    const stack = newBoardValidateStack()

    const resource = initLoginIDBoardFieldAction({ name: "field" }, { stack })
    resource.input.linkStore(standardBoardValueStore())

    return { resource }
}
