import { initMockAuthenticatePasswordResource } from "../../password/authenticate/Action/mock"
import { initMockRequestResetTokenResource } from "../../password/reset/requestToken/Action/mock"
import { initMockResetPasswordResource } from "../../password/reset/reset/x_Action/Reset/mock"
import { initMockStartPasswordResetSessionResource } from "../../password/reset/checkStatus/Action/mock"
import { initMockCheckAuthInfoResource } from "../../kernel/authInfo/check/Action/mock"
import { initSignViewLocationDetecter } from "../impl/testHelper"
import { SignAction, SignActionState } from "./Core/action"
import { initSignAction } from "./Core/impl"
import { toSignEntryPoint } from "./impl"
import { initSyncActionTestRunner } from "../../../../z_vendor/getto-application/action/testHelper"

describe("SignView", () => {
    test("redirect login view", (done) => {
        const { action } = standardLoginView()

        action.subscriber.subscribe(stateHandler())

        action.ignite()

        function stateHandler(): Handler<SignActionState> {
            const stack: SignActionState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.core.ignite()
                        break

                    case "password-authenticate":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-authenticate" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-reset-requestToken":
                    case "password-reset-checkStatus":
                    case "password-reset":
                        done(new Error(state.type))
                        break

                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("password reset request token", (done) => {
        const { action } = passwordResetSessionLoginView()

        action.subscriber.subscribe(stateHandler())

        action.ignite()

        function stateHandler(): Handler<SignActionState> {
            const stack: SignActionState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.core.ignite()
                        break

                    case "password-reset-requestToken":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-reset-requestToken" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-authenticate":
                    case "password-reset-checkStatus":
                    case "password-reset":
                        done(new Error(state.type))
                        break

                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("password reset check status", (done) => {
        const { action } = passwordResetCheckStatusLoginView()

        action.subscriber.subscribe(stateHandler())

        action.ignite()

        function stateHandler(): Handler<SignActionState> {
            const stack: SignActionState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.core.ignite()
                        break

                    case "password-reset-checkStatus":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-reset-checkStatus" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-authenticate":
                    case "password-reset-requestToken":
                    case "password-reset":
                        done(new Error(state.type))
                        break

                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("password reset", (done) => {
        const { action } = passwordResetLoginView()

        action.subscriber.subscribe(stateHandler())

        action.ignite()

        function stateHandler(): Handler<SignActionState> {
            const stack: SignActionState[] = []
            const terminates: Terminate[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                        terminates.push(state.entryPoint.terminate)

                        state.entryPoint.resource.core.ignite()
                        break

                    case "password-reset":
                        terminates.push(state.entryPoint.terminate)

                        expect(stack[0]).toMatchObject({ type: "renew-credential" })
                        expect(stack[1]).toMatchObject({ type: "password-reset" })

                        terminates.forEach((terminate) => terminate())
                        done()
                        break

                    case "password-authenticate":
                    case "password-reset-requestToken":
                    case "password-reset-checkStatus":
                        done(new Error(state.type))
                        break

                    case "error":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("error", (done) => {
        const { action } = standardLoginView()

        action.subscriber.subscribe(stateHandler())

        action.error("view error")

        function stateHandler(): Handler<SignActionState> {
            const stack: SignActionState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-view":
                        // work in progress...
                        break

                    case "renew-credential":
                    case "password-authenticate":
                    case "password-reset-requestToken":
                    case "password-reset-checkStatus":
                    case "password-reset":
                        done(new Error(state.type))
                        break

                    case "error":
                        expect(stack).toEqual([{ type: "error", err: "view error" }])
                        done()
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("terminate", (done) => {
        const { action } = standardLoginView()
        const entryPoint = toSignEntryPoint(action)

        const runner = initSyncActionTestRunner([
            {
                statement: () => {
                    entryPoint.terminate()
                    entryPoint.resource.view.error("view error")
                },
                examine: (stack) => {
                    // no input/validate event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        entryPoint.resource.view.subscriber.subscribe(runner(done))
    })
})

function standardLoginView() {
    const currentURL = standardURL()
    const action = standardSignAction(currentURL)

    return { action }
}
function passwordResetSessionLoginView() {
    const currentURL = passwordResetSessionURL()
    const action = standardSignAction(currentURL)

    return { action }
}
function passwordResetCheckStatusLoginView() {
    const currentURL = passwordResetCheckStatusURL()
    const action = standardSignAction(currentURL)

    return { action }
}
function passwordResetLoginView() {
    const currentURL = passwordResetURL()
    const action = standardSignAction(currentURL)

    return { action }
}
function standardSignAction(currentURL: URL): SignAction {
    return initSignAction(initSignViewLocationDetecter(currentURL), {
        renew: () => standardRenewCredentialEntryPoint(),
        password_authenticate: () => standardPasswordLoginEntryPoint(),
        password_reset: () => standardPasswordResetResource(),
        password_reset_requestToken: () => standardRequestPasswordResetTokenResource(),
        password_reset_checkStatus: () => standardCheckPasswordResetSendingStatusResource(),
    })
}

function standardPasswordLoginEntryPoint() {
    return {
        resource: initMockAuthenticatePasswordResource(),
        terminate: () => null,
    }
}
function standardPasswordResetResource() {
    return {
        resource: initMockResetPasswordResource(),
        terminate: () => null,
    }
}
function standardRequestPasswordResetTokenResource() {
    return {
        resource: initMockRequestResetTokenResource(),
        terminate: () => null,
    }
}
function standardCheckPasswordResetSendingStatusResource() {
    return {
        resource: initMockStartPasswordResetSessionResource(),
        terminate: () => null,
    }
}
function standardRenewCredentialEntryPoint() {
    return {
        resource: initMockCheckAuthInfoResource(),
        terminate: () => null,
    }
}

function standardURL(): URL {
    return new URL("https://example.com/index.html")
}
function passwordResetSessionURL(): URL {
    return new URL("https://example.com/index.html?_password_reset=requestToken")
}
function passwordResetCheckStatusURL(): URL {
    return new URL("https://example.com/index.html?_password_reset=checkStatus")
}
function passwordResetURL(): URL {
    return new URL("https://example.com/index.html?_password_reset=reset")
}

interface Handler<T> {
    (state: T): void
}
interface Terminate {
    (): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
