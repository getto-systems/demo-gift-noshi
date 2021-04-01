import {
    setupAsyncActionTestRunner,
    setupSyncActionTestRunner,
} from "../../z_vendor/getto-application/action/test_helper"

import { mockPreviewResource } from "./mock"

import {
    loadCurrentDeliverySlipEventHasDone,
    loadDeliverySlipsEventHasDone,
} from "../load_slips/impl/core"

import { PreviewResource } from "./resource"

import { PreviewSlipsState } from "./slips/action"
import { PreviewCoreState } from "./core/action"

describe("Preview", () => {
    test("load slips", () =>
        new Promise<void>((done) => {
            const { resource } = standard()

            const runner = setupAsyncActionTestRunner(slipsActionHasDone, [
                {
                    statement: () => {
                        resource.preview.slips.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-load",
                                slips: [
                                    {
                                        data: {
                                            number: "0001",
                                            name: "鈴木一郎",
                                            size: "A4",
                                            type: "御歳暮",
                                        },
                                        printState: "working",
                                    },
                                    {
                                        data: {
                                            number: "0002",
                                            name: "山田花子",
                                            size: "A3",
                                            type: "内祝",
                                        },
                                        printState: "waiting",
                                    },
                                ],
                            },
                        ])
                    },
                },
            ])

            resource.preview.slips.subscriber.subscribe(runner(done))
        }))

    test("load slips; numbered", () =>
        new Promise<void>((done) => {
            const { resource } = numbered()

            const runner = setupAsyncActionTestRunner(slipsActionHasDone, [
                {
                    statement: () => {
                        resource.preview.slips.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-load",
                                slips: [
                                    {
                                        data: {
                                            number: "0001",
                                            name: "鈴木一郎",
                                            size: "A4",
                                            type: "御歳暮",
                                        },
                                        printState: "done",
                                    },
                                    {
                                        data: {
                                            number: "0002",
                                            name: "山田花子",
                                            size: "A3",
                                            type: "内祝",
                                        },
                                        printState: "working",
                                    },
                                ],
                            },
                        ])
                    },
                },
            ])

            resource.preview.slips.subscriber.subscribe(runner(done))
        }))

    test("next slip href", () => {
        const { resource } = standard()

        expect(resource.preview.slips.nextSlipHref()).toEqual({ hasNext: false })
    })

    test("load slip", () =>
        new Promise<void>((done) => {
            const { resource } = standard()

            const runner = setupAsyncActionTestRunner(coreActionHasDone, [
                {
                    statement: () => {
                        resource.preview.core.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-load",
                                slip: {
                                    number: "0001",
                                    name: "鈴木一郎",
                                    size: "A4",
                                    type: "御歳暮",
                                },
                            },
                        ])
                    },
                },
            ])

            resource.preview.core.subscriber.subscribe(runner(done))
        }))

    test("load slip; numbered", () =>
        new Promise<void>((done) => {
            const { resource } = numbered()

            const runner = setupAsyncActionTestRunner(coreActionHasDone, [
                {
                    statement: () => {
                        resource.preview.core.ignite()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-load",
                                slip: {
                                    number: "0002",
                                    name: "山田花子",
                                    size: "A3",
                                    type: "内祝",
                                },
                            },
                        ])
                    },
                },
            ])

            resource.preview.core.subscriber.subscribe(runner(done))
        }))

    test("reset", () =>
        new Promise<void>((done) => {
            const { resource } = standard()

            const runner = setupSyncActionTestRunner([
                {
                    statement: () => {
                        resource.preview.form.reset()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([""])
                    },
                },
            ])

            const handler = runner(done)
            resource.preview.form.noshiName.board.input.subscribeInputEvent(() =>
                handler(resource.preview.form.noshiName.board.input.get()),
            )
        }))
})

function standard() {
    const resource = initResource(standard_URL())

    return { resource }
}
function numbered() {
    const resource = initResource(numbered_URL())

    return { resource }
}

function initResource(url: URL): PreviewResource {
    return mockPreviewResource(url)
}

function standard_URL(): URL {
    return new URL("https://example.com/preview.html")
}
function numbered_URL(): URL {
    return new URL("https://example.com/preview.html?number=0002")
}

function coreActionHasDone(state: PreviewCoreState): boolean {
    switch (state.type) {
        case "initial-preview":
            return false

        default:
            return loadCurrentDeliverySlipEventHasDone(state)
    }
}
function slipsActionHasDone(state: PreviewSlipsState): boolean {
    switch (state.type) {
        case "initial-slips":
            return false

        default:
            return loadDeliverySlipsEventHasDone(state)
    }
}
