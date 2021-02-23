import { CheckSendingStatusInfra } from "./infra"

import { CheckSendingStatusLocationInfo, CheckSendingStatusMethodPod } from "./method"

import { CheckSendingStatusEvent } from "./event"

import { CheckSendingStatusError } from "./data"
import { markResetSessionID, ResetSessionID } from "../kernel/data"
import { authSignSearchKey_password_reset_sessionID } from "../../../common/searchParams/data"

export function initCheckSendingStatusLocationInfo(
    currentURL: URL,
): CheckSendingStatusLocationInfo {
    return {
        getPasswordResetSessionID: () => detectSessionID(currentURL),
    }
}

function detectSessionID(currentURL: URL): ResetSessionID {
    return markResetSessionID(
        currentURL.searchParams.get(authSignSearchKey_password_reset_sessionID()) || "",
    )
}

interface CheckStatus {
    (infra: CheckSendingStatusInfra): CheckSendingStatusMethodPod
}
export const checkSendingStatus: CheckStatus = (infra) => (locationInfo) => async (post) => {
    const { getStatus, sendToken, config, wait } = infra

    const sessionID = locationInfo.getPasswordResetSessionID()
    if (sessionID.length === 0) {
        post({ type: "failed-to-check-status", err: { type: "empty-session-id" } })
        return
    }

    type SendTokenState =
        | Readonly<{ type: "initial" }>
        | Readonly<{ type: "failed"; err: CheckSendingStatusError }>
        | Readonly<{ type: "success" }>

    let sendTokenState: SendTokenState = { type: "initial" }
    function getSendTokenState(): SendTokenState {
        return sendTokenState
    }

    post({ type: "try-to-check-status" })

    requestSendToken()

    for (let i_ = 0; i_ < config.limit.limit; i_++) {
        const currentSendTokenState = getSendTokenState()
        if (currentSendTokenState.type === "failed") {
            post({ type: "failed-to-check-status", err: currentSendTokenState.err })
            return
        }

        const response = await getStatus(sessionID)
        if (!response.success) {
            post({ type: "failed-to-check-status", err: response.err })
            return
        }

        const result = response.value
        if (result.done) {
            if (!result.send) {
                post({
                    type: "failed-to-send-token",
                    err: { type: "infra-error", err: result.err },
                })
                return
            }

            post({ type: "succeed-to-send-token" })
            return
        }

        post({ type: "retry-to-check-status", status: result.status })

        await wait(config.wait, () => true)
    }

    post({
        type: "failed-to-check-status",
        err: { type: "infra-error", err: "overflow check limit" },
    })

    async function requestSendToken() {
        const response = await sendToken(null)
        if (!response.success) {
            sendTokenState = { type: "failed", err: response.err }
            return
        }
        sendTokenState = { type: "success" }
    }
}

export function checkSessionStatusEventHasDone(event: CheckSendingStatusEvent): boolean {
    switch (event.type) {
        case "succeed-to-send-token":
        case "failed-to-check-status":
        case "failed-to-send-token":
            return true

        case "try-to-check-status":
        case "retry-to-check-status":
            return false
    }
}