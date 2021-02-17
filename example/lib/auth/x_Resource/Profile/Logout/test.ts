import { ClearAuthnInfoState } from "../../../sign/x_Action/AuthnInfo/Clear/action"

import { markAuthAt, markAuthnNonce } from "../../../sign/authnInfo/common/data"
import { initMemoryApiCredentialRepository } from "../../../../common/apiCredential/infra/repository/memory"
import { markApiNonce, markApiRoles } from "../../../../common/apiCredential/data"
import { initMemoryAuthnInfoRepository } from "../../../sign/authnInfo/common/infra/repository/authnInfo/memory"
import { initClearAuthnInfoAction } from "../../../sign/x_Action/AuthnInfo/Clear/impl"

const STORED_AUTHN_NONCE = "stored-authn-nonce" as const
const STORED_LOGIN_AT = new Date("2020-01-01 09:00:00")

describe("Logout", () => {
    test("clear", (done) => {
        const { resource } = standardResource()

        resource.clear.addStateHandler(stateHandler())

        resource.clear.submit()

        function stateHandler(): Post<ClearAuthnInfoState> {
            const stack: ClearAuthnInfoState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-logout":
                        // work in progress...
                        break

                    case "succeed-to-logout":
                        expect(stack).toEqual([{ type: "succeed-to-logout" }])
                        done()
                        break

                    case "failed-to-logout":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })
})

function standardResource() {
    const repository = standardRepository()

    const resource = {
        clear: initClearAuthnInfoAction({ clear: repository }),
    }

    return { repository, resource }
}

function standardRepository() {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: true,
            value: {
                apiNonce: markApiNonce("api-nonce"),
                apiRoles: markApiRoles(["role"]),
            },
        }),
        authnInfos: initMemoryAuthnInfoRepository({
            authnNonce: { set: true, value: markAuthnNonce(STORED_AUTHN_NONCE) },
            lastAuthAt: { set: true, value: markAuthAt(STORED_LOGIN_AT) },
        }),
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}