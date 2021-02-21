import { newAuthenticatePasswordHandler } from "../../../../../../auth/sign/password/authenticate/x_Action/Authenticate/main/worker/background"
import { newStartPasswordResetSessionResourceHandler } from "../../../../../../auth/x_Resource/Sign/Password/ResetSession/Start/main/worker/background"

import { WorkerHandler } from "../../../../../../z_getto/application/worker/background"

import { ForegroundMessage, BackgroundMessage } from "./message"
import { AuthenticatePasswordProxyMessage } from "../../../../../../auth/sign/password/authenticate/x_Action/Authenticate/main/worker/message"
import { StartPasswordResetSessionResourceProxyMessage } from "../../../../../../auth/x_Resource/Sign/Password/ResetSession/Start/main/worker/message"
import { newRegisterPasswordHandler } from "../../../../../../auth/sign/password/resetSession/register/x_Action/Register/main/worker/background"
import { RegisterPasswordProxyMessage } from "../../../../../../auth/sign/password/resetSession/register/x_Action/Register/main/worker/message"

export function newLoginWorker(worker: Worker): void {
    const handler: Handler = {
        password: {
            authenticate: newAuthenticatePasswordHandler((response) =>
                postBackgroundMessage({ type: "password-authenticate", response })
            ),
            resetSession: {
                register: newRegisterPasswordHandler((response) =>
                    postBackgroundMessage({
                        type: "password-resetSession-register",
                        response,
                    })
                ),
                start: newStartPasswordResetSessionResourceHandler((response) =>
                    postBackgroundMessage({ type: "password-resetSession-start", response })
                ),
            },
        },
    }

    const messageHandler = initForegroundMessageHandler(handler, (err: string) => {
        postBackgroundMessage({ type: "error", err })
    })

    worker.addEventListener("message", (event) => {
        messageHandler(event.data)
    })

    function postBackgroundMessage(message: BackgroundMessage) {
        worker.postMessage(message)
    }
}

type Handler = Readonly<{
    password: Readonly<{
        authenticate: WorkerHandler<AuthenticatePasswordProxyMessage>
        resetSession: Readonly<{
            register: WorkerHandler<RegisterPasswordProxyMessage>
            start: WorkerHandler<StartPasswordResetSessionResourceProxyMessage>
        }>
    }>
}>

function initForegroundMessageHandler(
    handler: Handler,
    errorHandler: Post<string>
): Post<ForegroundMessage> {
    return (message) => {
        try {
            switch (message.type) {
                case "password-authenticate":
                    handler.password.authenticate(message.message)
                    break

                case "password-resetSession-start":
                    handler.password.resetSession.start(message.message)
                    break

                case "password-resetSession-register":
                    handler.password.resetSession.register(message.message)
                    break

                default:
                    assertNever(message)
            }
        } catch (err) {
            errorHandler(`${err}`)
        }
    }
}

interface Post<M> {
    (message: M): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
