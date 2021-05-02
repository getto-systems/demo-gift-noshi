import {
    setupAsyncActionTestRunner,
    setupSyncActionTestRunner,
} from "../../../z_vendor/getto-application/action/test_helper_legacy"

import { markApplicationTargetPath } from "../find_next/impl/test_helper"

import { mockRemotePod } from "../../../z_vendor/getto-application/infra/remote/mock"
import { mockFindNextVersionLocationDetecter } from "../find_next/impl/mock"

import { initFindNextVersionView } from "./impl"
import { initFindNextVersionCoreAction, initFindNextVersionCoreMaterial } from "./core/impl"

import { findNextVersionEventHasDone } from "../find_next/impl/core"

import { applicationPath } from "../find_next/impl/helper"

import { CheckDeployExistsRemotePod } from "../find_next/infra"

import { FindNextVersionView } from "./resource"

import { FindNextVersionCoreState } from "./core/action"

describe("FindNextVersion", () => {
    test("up to date", () =>
        new Promise<void>((done) => {
            const { view } = standard()
            const resource = view.resource

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.findNext.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: true,
                                version: "1.0.0",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                    },
                },
            ])

            resource.findNext.subscriber.subscribe(runner(done))
        }))

    test("up to date; take longtime", () =>
        new Promise<void>((done) => {
            const { view } = takeLongtime()
            const resource = view.resource

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.findNext.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            { type: "take-longtime-to-find" },
                            {
                                type: "succeed-to-find",
                                upToDate: true,
                                version: "1.0.0",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                    },
                },
            ])

            resource.findNext.subscriber.subscribe(runner(done))
        }))

    test("found next minor version", () =>
        new Promise<void>((done) => {
            const { view } = found(["/1.1.0/index.html"])
            const resource = view.resource

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.findNext.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: false,
                                version: "1.1.0",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                    },
                },
            ])

            resource.findNext.subscriber.subscribe(runner(done))
        }))

    test("found next patch version", () =>
        new Promise<void>((done) => {
            const { view } = found(["/1.0.1/index.html"])
            const resource = view.resource

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.findNext.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: false,
                                version: "1.0.1",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                    },
                },
            ])

            resource.findNext.subscriber.subscribe(runner(done))
        }))

    test("found next minor version; recursive", () =>
        new Promise<void>((done) => {
            const { view } = found(["/1.1.0/index.html", "/1.2.0/index.html"])
            const resource = view.resource

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.findNext.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: false,
                                version: "1.2.0",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                    },
                },
            ])

            resource.findNext.subscriber.subscribe(runner(done))
        }))

    test("found next patch version; recursive", () =>
        new Promise<void>((done) => {
            const { view } = found(["/1.0.1/index.html", "/1.0.2/index.html"])
            const resource = view.resource

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.findNext.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: false,
                                version: "1.0.2",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                    },
                },
            ])

            resource.findNext.subscriber.subscribe(runner(done))
        }))

    test("found next patch version; complex", () =>
        new Promise<void>((done) => {
            const { view } = found(["/1.1.0/index.html", "/1.1.1/index.html"])
            const resource = view.resource

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.findNext.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: false,
                                version: "1.1.1",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                    },
                },
            ])

            resource.findNext.subscriber.subscribe(runner(done))
        }))

    test("found next patch version; complex skipped", () =>
        new Promise<void>((done) => {
            const { view } = found(["/1.1.0/index.html", "/1.1.1/index.html", "/1.1.3/index.html"])
            const resource = view.resource

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.findNext.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: false,
                                version: "1.1.1",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                    },
                },
            ])

            resource.findNext.subscriber.subscribe(runner(done))
        }))

    test("found next minor version; complex current version", () =>
        new Promise<void>((done) => {
            const { view } = foundComplex(["/1.1.0/index.html"])
            const resource = view.resource

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.findNext.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: false,
                                version: "1.1.0",
                                target: {
                                    valid: true,
                                    value: "/index.html?search=parameter#hash",
                                },
                            },
                        ])
                    },
                },
            ])

            resource.findNext.subscriber.subscribe(runner(done))
        }))

    test("invalid version url", () =>
        new Promise<void>((done) => {
            const { view } = invalidVersion()
            const resource = view.resource

            const runner = setupAsyncActionTestRunner(actionHasDone, [
                {
                    statement: () => {
                        resource.findNext.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-find",
                                upToDate: true,
                                version: "1.0.0",
                                target: {
                                    valid: false,
                                },
                            },
                        ])
                    },
                },
            ])

            resource.findNext.subscriber.subscribe(runner(done))
        }))

    test("valid ApplicationTargetPath", () => {
        expect(
            applicationPath("1.0.0", {
                valid: true,
                value: markApplicationTargetPath("/path/to/target.html"),
            }),
        ).toEqual("/1.0.0/path/to/target.html")
    })

    test("invalid ApplicationTargetPath", () => {
        expect(applicationPath("1.0.0", { valid: false })).toEqual("/1.0.0/index.html")
    })

    test("terminate", () =>
        new Promise<void>((done) => {
            const { view } = standard()

            const runner = setupSyncActionTestRunner([
                {
                    statement: (check) => {
                        view.terminate()
                        view.resource.findNext.ignite()

                        setTimeout(check, 256) // wait for event...
                    },
                    examine: (stack) => {
                        // no input/validate event after terminate
                        expect(stack).toEqual([])
                    },
                },
            ])

            view.resource.findNext.subscriber.subscribe(runner(done))
        }))
})

function standard() {
    const view = initView(standard_URL(), standard_version(), standard_check())

    return { view }
}
function found(versions: string[]) {
    const view = initView(standard_URL(), standard_version(), found_check(versions))

    return { view }
}
function foundComplex(versions: string[]) {
    const view = initView(complex_URL(), complex_Version(), found_check(versions))

    return { view }
}
function invalidVersion() {
    const view = initView(invalidVersion_URL(), standard_version(), standard_check())

    return { view }
}
function takeLongtime() {
    const view = initView(standard_URL(), standard_version(), takeLongtime_check())

    return { view }
}

function initView(
    currentURL: URL,
    version: string,
    check: CheckDeployExistsRemotePod,
): FindNextVersionView {
    return initFindNextVersionView({
        findNext: initFindNextVersionCoreAction(
            initFindNextVersionCoreMaterial(
                {
                    check,
                    version,
                    config: {
                        takeLongtimeThreshold: { delay_millisecond: 1 },
                    },
                },
                mockFindNextVersionLocationDetecter(currentURL, version),
            ),
        ),
    })
}

function standard_version(): string {
    return "1.0.0"
}
function complex_Version(): string {
    return "1.0.0-rc1"
}

function standard_URL(): URL {
    return new URL("https://example.com/1.0.0/index.html?search=parameter#hash")
}
function complex_URL(): URL {
    return new URL("https://example.com/1.0.0-rc1/index.html?search=parameter#hash")
}
function invalidVersion_URL(): URL {
    return new URL("https://example.com/invalid.html?search=parameter#hash")
}

function standard_check(): CheckDeployExistsRemotePod {
    return mockRemotePod(() => ({ success: true, value: { found: false } }), {
        wait_millisecond: 0,
    })
}
function found_check(versions: string[]): CheckDeployExistsRemotePod {
    return mockRemotePod(
        (version) => {
            return { success: true, value: { found: versions.includes(version) } }
        },
        { wait_millisecond: 0 },
    )
}
function takeLongtime_check(): CheckDeployExistsRemotePod {
    return mockRemotePod(() => ({ success: true, value: { found: false } }), {
        wait_millisecond: 2,
    })
}

function actionHasDone(state: FindNextVersionCoreState): boolean {
    switch (state.type) {
        case "initial-next-version":
            return false

        default:
            return findNextVersionEventHasDone(state)
    }
}
