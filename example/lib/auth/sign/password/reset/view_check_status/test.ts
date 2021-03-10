import {
    setupAsyncActionTestRunner,
    setupSyncActionTestRunner,
} from "../../../../../z_vendor/getto-application/action/test_helper"

import { mockRemotePod } from "../../../../../z_vendor/getto-application/infra/remote/mock"

import { mockCheckResetTokenSendingStatusLocationDetecter } from "../check_status/impl/mock"

import { initCheckResetTokenSendingStatusEntryPoint } from "./impl"
import {
    initCheckResetTokenSendingStatusCoreAction,
    initCheckResetTokenSendingStatusCoreMaterial,
} from "./core/impl"

import { checkSessionStatusEventHasDone } from "../check_status/impl/core"

import {
    GetResetTokenSendingStatusRemotePod,
    GetResetTokenSendingStatusResult,
    SendResetTokenRemotePod,
    SendResetTokenResult,
} from "../check_status/infra"

import { CheckResetTokenSendingStatusEntryPoint } from "./entry_point"

import { CheckResetTokenSendingStatusCoreState } from "./core/action"

import { ResetTokenSendingResult } from "../check_status/data"

describe("CheckPasswordResetSendingStatus", () => {
    test("valid session-id", (done) => {
        const { entryPoint } = standard()
        const resource = entryPoint.resource.checkStatus

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.ignite()
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        { type: "try-to-check-status" },
                        { type: "succeed-to-send-token" },
                    ])
                },
            },
        ])

        resource.subscriber.subscribe(runner(done))
    })

    test("submit valid login-id; with long sending", (done) => {
        // wait for send token check limit
        const { entryPoint } = takeLongTime()
        const resource = entryPoint.resource.checkStatus

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.ignite()
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        { type: "try-to-check-status" },
                        { type: "retry-to-check-status", status: { sending: true } },
                        { type: "retry-to-check-status", status: { sending: true } },
                        { type: "retry-to-check-status", status: { sending: true } },
                        { type: "retry-to-check-status", status: { sending: true } },
                        { type: "retry-to-check-status", status: { sending: true } },
                        {
                            type: "failed-to-check-status",
                            err: { type: "infra-error", err: "overflow check limit" },
                        },
                    ])
                },
            },
        ])

        resource.subscriber.subscribe(runner(done))
    })

    test("check without session id", (done) => {
        const { entryPoint } = noSessionID()
        const resource = entryPoint.resource.checkStatus

        const runner = setupAsyncActionTestRunner(actionHasDone, [
            {
                statement: () => {
                    resource.ignite()
                },
                examine: (stack) => {
                    expect(stack).toEqual([
                        { type: "failed-to-check-status", err: { type: "empty-session-id" } },
                    ])
                },
            },
        ])

        resource.subscriber.subscribe(runner(done))
    })

    test("terminate", (done) => {
        const { entryPoint } = standard()
        const resource = entryPoint.resource.checkStatus

        const runner = setupSyncActionTestRunner([
            {
                statement: (check) => {
                    entryPoint.terminate()
                    resource.ignite()

                    setTimeout(check, 256) // wait for events...
                },
                examine: (stack) => {
                    // no input/validate event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        resource.subscriber.subscribe(runner(done))
    })
})

function standard() {
    const entryPoint = initEntryPoint(standard_URL(), standard_sendToken(), standard_getStatus())

    return { entryPoint }
}
function takeLongTime() {
    const entryPoint = initEntryPoint(
        standard_URL(),
        takeLongTime_sendToken(),
        takeLongTime_getStatus(),
    )

    return { entryPoint }
}
function noSessionID() {
    const entryPoint = initEntryPoint(noSessionID_URL(), standard_sendToken(), standard_getStatus())

    return { entryPoint }
}

function initEntryPoint(
    currentURL: URL,
    sendToken: SendResetTokenRemotePod,
    getStatus: GetResetTokenSendingStatusRemotePod,
): CheckResetTokenSendingStatusEntryPoint {
    const checkStatusDetecter = mockCheckResetTokenSendingStatusLocationDetecter(currentURL)
    return initCheckResetTokenSendingStatusEntryPoint(
        initCheckResetTokenSendingStatusCoreAction(
            initCheckResetTokenSendingStatusCoreMaterial(
                {
                    sendToken,
                    getStatus,
                    config: {
                        wait: { wait_millisecond: 32 },
                        limit: { limit: 5 },
                    },
                },
                checkStatusDetecter,
            ),
        ),
    )
}

function standard_URL() {
    return new URL(
        "https://example.com/index.html?-password-reset=check-status&-password-reset-session-id=session-id",
    )
}
function noSessionID_URL() {
    return new URL("https://example.com/index.html?-password-reset=check-status")
}

function standard_sendToken(): SendResetTokenRemotePod {
    return mockRemotePod(simulateSendToken, { wait_millisecond: 0 })
}
function takeLongTime_sendToken(): SendResetTokenRemotePod {
    return mockRemotePod(simulateSendToken, { wait_millisecond: 64 })
}

function standard_getStatus(): GetResetTokenSendingStatusRemotePod {
    return getStatusRemoteAccess([{ done: true, send: true }])
}
function takeLongTime_getStatus(): GetResetTokenSendingStatusRemotePod {
    // 完了するまでに 5回以上かかる
    return getStatusRemoteAccess([
        { done: false, status: { sending: true } },
        { done: false, status: { sending: true } },
        { done: false, status: { sending: true } },
        { done: false, status: { sending: true } },
        { done: false, status: { sending: true } },
        { done: false, status: { sending: true } },
    ])
}

function simulateSendToken(): SendResetTokenResult {
    return { success: true, value: true }
}
function getStatusRemoteAccess(
    responseCollection: ResetTokenSendingResult[],
): GetResetTokenSendingStatusRemotePod {
    let position = 0
    return mockRemotePod(
        (): GetResetTokenSendingStatusResult => {
            if (responseCollection.length === 0) {
                return { success: false, err: { type: "infra-error", err: "no response" } }
            }
            const response = getResponse()
            position++

            return { success: true, value: response }
        },
        { wait_millisecond: 0 },
    )

    function getResponse(): ResetTokenSendingResult {
        if (position < responseCollection.length) {
            return responseCollection[position]
        }
        return responseCollection[responseCollection.length - 1]
    }
}

function actionHasDone(state: CheckResetTokenSendingStatusCoreState): boolean {
    switch (state.type) {
        case "initial-check-status":
            return false

        case "try-to-check-status":
        case "retry-to-check-status":
        case "failed-to-check-status":
        case "failed-to-send-token":
        case "succeed-to-send-token":
            return checkSessionStatusEventHasDone(state)
    }
}
