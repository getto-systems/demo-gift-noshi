import { newRenewAuthnInfo } from "../../../../../../auth/sign/kernel/authInfo/check/Action/init"

import { initLoginViewLocationInfo, toAuthSignEntryPoint, View } from "../../impl"

import {
    AuthenticatePasswordProxy,
    newAuthenticatePasswordProxy,
} from "../../../../../../auth/sign/password/authenticate/x_Action/Authenticate/init/worker/foreground"
import {
    newRequestPasswordResetTokenProxy,
    RequestPasswordResetTokenProxy,
} from "../../../../../../auth/sign/password/reset/requestToken/x_Action/RequestToken/init/worker/foreground"
import {
    CheckPasswordResetSendingStatusProxy,
    newCheckPasswordResetSendingStatusProxy,
} from "../../../../../../auth/sign/password/reset/checkStatus/x_Action/CheckStatus/init/worker/foreground"
import {
    newResetPasswordProxy,
    ResetPasswordProxy,
} from "../../../../../../auth/sign/password/reset/reset/x_Action/Reset/init/worker/foreground"

import { ForegroundMessage, BackgroundMessage } from "./message"

import { AuthSignAction, AuthSignEntryPoint } from "../../entryPoint"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentURL: URL
    currentLocation: Location
    worker: Worker
}>
export function newWorkerForeground(feature: OutsideFeature): AuthSignEntryPoint {
    const { webStorage, currentURL, currentLocation, worker } = feature
    const proxy = initProxy(webStorage, currentURL, postForegroundMessage)

    const view: AuthSignAction = new View(initLoginViewLocationInfo(currentURL), {
        renew: () => newRenewAuthnInfo(webStorage, currentURL),

        password_authenticate: () => proxy.password.authenticate.entryPoint(webStorage, currentURL),
        password_reset_requestToken: () => proxy.password.reset.requestToken.entryPoint(),
        password_reset_checkStatus: () =>
            proxy.password.reset.checkStatus.entryPoint(currentLocation),
        password_reset: () =>
            proxy.password.reset.reset.entryPoint(webStorage, currentURL, currentLocation),
    })

    const messageHandler = initBackgroundMessageHandler(proxy, (err: string) => {
        view.error(err)
    })

    worker.addEventListener("message", (event) => {
        messageHandler(event.data)
    })

    const entryPoint = toAuthSignEntryPoint(view)
    return {
        resource: entryPoint.resource,
        terminate: () => {
            worker.terminate()
            entryPoint.terminate()
        },
    }

    function postForegroundMessage(message: ForegroundMessage) {
        worker.postMessage(message)
    }
}

type Proxy = Readonly<{
    password: Readonly<{
        authenticate: AuthenticatePasswordProxy
        reset: Readonly<{
            requestToken: RequestPasswordResetTokenProxy
            checkStatus: CheckPasswordResetSendingStatusProxy
            reset: ResetPasswordProxy
        }>
    }>
}>
function initProxy(webStorage: Storage, currentURL: URL, post: Post<ForegroundMessage>): Proxy {
    return {
        password: {
            authenticate: newAuthenticatePasswordProxy((message) =>
                post({ type: "password-authenticate", message }),
            ),
            reset: {
                requestToken: newRequestPasswordResetTokenProxy((message) =>
                    post({ type: "password-reset-requestToken", message }),
                ),
                checkStatus: newCheckPasswordResetSendingStatusProxy((message) =>
                    post({ type: "password-reset-checkStatus", message }),
                ),
                reset: newResetPasswordProxy((message) =>
                    post({ type: "password-reset", message }),
                ),
            },
        },
    }
}
function initBackgroundMessageHandler(
    proxy: Proxy,
    errorHandler: Post<string>,
): Post<BackgroundMessage> {
    return (message) => {
        try {
            switch (message.type) {
                case "password-authenticate":
                    proxy.password.authenticate.resolve(message.response)
                    break

                case "password-reset-requestToken":
                    proxy.password.reset.requestToken.resolve(message.response)
                    break

                case "password-reset-checkStatus":
                    proxy.password.reset.checkStatus.resolve(message.response)
                    break

                case "password-reset":
                    proxy.password.reset.reset.resolve(message.response)
                    break

                case "error":
                    errorHandler(message.err)
                    break

                default:
                    assertNever(message)
            }
        } catch (err) {
            errorHandler(`${err}`)
        }
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}

interface Post<T> {
    (state: T): void
}
