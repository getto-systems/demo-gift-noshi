import { setupAsyncActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"

import { standard_DeliverySlips } from "../slip/test_helper"

import { mockLoadDeliverySlipsLocationDetecter } from "../load_slips/impl/mock"

import { initPreviewAction } from "./impl"
import { initPreviewCoreAction, initPreviewCoreMaterial } from "./core/impl"
import { initPreviewSlipsAction, initPreviewSlipsMaterial } from "./slips/impl"

import {
    loadCurrentDeliverySlipEventHasDone,
    loadDeliverySlipsEventHasDone,
} from "../load_slips/impl/core"
import { printDeliverySlipsEventHasDone } from "../print_slips/impl/core"

import { DeliverySlipSheet } from "../print_slips/infra"

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
                                        href: "?number=0001",
                                    },
                                    {
                                        data: {
                                            number: "0002",
                                            name: "山田花子",
                                            size: "A3",
                                            type: "内祝",
                                        },
                                        printState: "waiting",
                                        href: "?number=0002",
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
                                        href: "?number=0001",
                                    },
                                    {
                                        data: {
                                            number: "0002",
                                            name: "山田花子",
                                            size: "A3",
                                            type: "内祝",
                                        },
                                        printState: "working",
                                        href: "?number=0002",
                                    },
                                ],
                            },
                        ])
                    },
                },
            ])

            resource.preview.slips.subscriber.subscribe(runner(done))
        }))

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
                                next: { hasNext: true, href: "?number=0002" },
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
                                next: { hasNext: false },
                            },
                        ])
                    },
                },
            ])

            resource.preview.core.subscriber.subscribe(runner(done))
        }))

    test("print slips", () =>
        new Promise<void>((done) => {
            const { resource } = standard()

            const runner = setupAsyncActionTestRunner(coreActionHasDone, [
                {
                    statement: () => {
                        resource.preview.core.print()
                    },
                    examine: (stack) => {
                        expect(stack).toEqual([
                            { type: "try-to-print" },
                            { type: "succeed-to-print", href: "#object-url" },
                        ])
                    },
                },
            ])

            resource.preview.core.subscriber.subscribe(runner(done))
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
    const slips = standard_DeliverySlips()
    const detecter = mockLoadDeliverySlipsLocationDetecter(url)
    const sheet = standard_sheet()
    return {
        preview: initPreviewAction(
            initPreviewCoreAction(initPreviewCoreMaterial({ slips, sheet }, detecter)),
            initPreviewSlipsAction(initPreviewSlipsMaterial({ slips }, detecter)),
        ),
    }
}

function standard_URL(): URL {
    return new URL("https://example.com/preview.html")
}
function numbered_URL(): URL {
    return new URL("https://example.com/preview.html?number=0002")
}

function standard_sheet(): DeliverySlipSheet {
    return async () => ({ success: true, href: "#object-url" })
}

function coreActionHasDone(state: PreviewCoreState): boolean {
    switch (state.type) {
        case "initial-preview":
            return false

        case "try-to-print":
        case "succeed-to-print":
        case "failed-to-print":
            return printDeliverySlipsEventHasDone(state)

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
