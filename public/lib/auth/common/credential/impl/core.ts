import { StoreInfra } from "../infra"

import { Find, Remove, Store } from "../action"

export const find = (infra: StoreInfra): Find => () => (post) => {
    const { authCredentials } = infra
    const ticketNonce = authCredentials.findTicketNonce()
    if (!ticketNonce.success) {
        post({ type: "failed-to-find", err: ticketNonce.err })
        return
    }
    if (!ticketNonce.found) {
        post({ type: "not-found" })
        return
    }

    const lastLoginAt = authCredentials.findLastLoginAt()
    if (!lastLoginAt.success) {
        post({ type: "failed-to-find", err: lastLoginAt.err })
        return
    }
    if (!lastLoginAt.found) {
        post({ type: "not-found" })
        return
    }

    post({
        type: "succeed-to-find",
        lastLogin: {
            ticketNonce: ticketNonce.content,
            lastLoginAt: lastLoginAt.content,
        },
    })
}

export const store = (infra: StoreInfra): Store => () => async (authCredential, post) => {
    const { authCredentials } = infra
    const storeResponse = authCredentials.storeAuthCredential(authCredential)
    if (!storeResponse.success) {
        post({ type: "failed-to-store", err: storeResponse.err })
        return
    }
    post({ type: "succeed-to-store" })
}

export const remove = (infra: StoreInfra): Remove => () => async (post) => {
    const { authCredentials } = infra
    const storeResponse = authCredentials.removeAuthCredential()
    if (!storeResponse.success) {
        post({ type: "failed-to-remove", err: storeResponse.err })
        return
    }
    post({ type: "succeed-to-remove" })
}
