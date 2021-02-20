import { markBoardValue } from "../../../../../../z_getto/board/kernel/data"
import { newBoardValidateStack } from "../../../../../../z_getto/board/kernel/infra/stack"
import { ValidateBoardFieldState } from "../../../../../../z_getto/board/validateField/x_Action/ValidateField/action"
import { initSyncActionChecker } from "../../../../../../z_getto/application/testHelper"
import { TogglePasswordDisplayBoardState } from "./action"
import { ValidatePasswordError } from "./data"
import { initPasswordBoardFieldAction } from "./impl"

describe("PasswordBoard", () => {
    test("validate; valid input", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardFieldState<ValidatePasswordError>>()
        resource.validate.addStateHandler(checker.handler)

        // valid input
        resource.input.set(markBoardValue("valid"))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: true }])
        })
        expect(resource.validate.get()).toEqual({ success: true, value: "valid" })
    })

    test("validate; invalid : empty", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardFieldState<ValidatePasswordError>>()
        resource.validate.addStateHandler(checker.handler)

        // empty
        resource.input.set(markBoardValue(""))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: false, err: ["empty"] }])
        })
        expect(resource.validate.get()).toEqual({ success: false })
    })

    test("validate; invalid : too-long", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardFieldState<ValidatePasswordError>>()
        resource.validate.addStateHandler(checker.handler)

        // too-long
        resource.input.set(markBoardValue("a".repeat(72 + 1)))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: false, err: ["too-long"] }])
        })
        expect(resource.validate.get()).toEqual({ success: false })
    })

    test("validate; valid : just max-length", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardFieldState<ValidatePasswordError>>()
        resource.validate.addStateHandler(checker.handler)

        // just max-length
        resource.input.set(markBoardValue("a".repeat(72)))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: true }])
        })
        expect(resource.validate.get()).toEqual({ success: true, value: "a".repeat(72) })
    })

    test("validate; invalid : too-long : multi-byte", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardFieldState<ValidatePasswordError>>()
        resource.validate.addStateHandler(checker.handler)

        // too-long : "あ"(UTF8) is 3 bytes character
        resource.input.set(markBoardValue("あ".repeat(24) + "a"))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: false, err: ["too-long"] }])
        })
        expect(resource.validate.get()).toEqual({ success: false })
    })

    test("validate; valid : just max-length : multi-byte", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardFieldState<ValidatePasswordError>>()
        resource.validate.addStateHandler(checker.handler)

        // just max-length : "あ"(UTF8) is 3 bytes character
        resource.input.set(markBoardValue("あ".repeat(24)))

        checker.check((stack) => {
            expect(stack).toEqual([{ valid: true }])
        })
        expect(resource.validate.get()).toEqual({ success: true, value: "あ".repeat(24) })
    })

    test("toggle password", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<TogglePasswordDisplayBoardState>()
        resource.toggle.addStateHandler(checker.handler)

        resource.toggle.show()

        checker.check((stack) => {
            expect(stack).toEqual([{ visible: true }])
        })

        resource.toggle.hide()

        checker.check((stack) => {
            expect(stack).toEqual([{ visible: false }])
        })
    })

    test("password character state : single byte", () => {
        const { resource } = standardResource()

        resource.input.set(markBoardValue("password"))
        expect(resource.characterState()).toEqual({ multiByte: false })
    })

    test("password character state : multi byte", () => {
        const { resource } = standardResource()

        resource.input.set(markBoardValue("パスワード"))
        expect(resource.characterState()).toEqual({ multiByte: true })
    })

    test("clear", () => {
        const { resource } = standardResource()

        resource.input.set(markBoardValue("valid"))
        resource.clear()

        expect(resource.input.get()).toEqual("")
    })

    test("terminate", () => {
        const { resource } = standardResource()

        const checker = initSyncActionChecker<ValidateBoardFieldState<ValidatePasswordError>>()
        resource.validate.addStateHandler(checker.handler)

        resource.input.terminate()

        resource.input.set(markBoardValue(""))

        checker.check((stack) => {
            expect(stack).toEqual([])
        })
    })
})

function standardResource() {
    const stack = newBoardValidateStack()

    const resource = initPasswordBoardFieldAction({ name: "field" }, { stack })

    return { resource }
}