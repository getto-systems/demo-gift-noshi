import { setupAsyncActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"

import { mockLoadDeliverySlipsLocationDetecter } from "../load_slips/impl/mock"

import { newLoadDeliverySlipsInfra } from "../load_slips/impl/init"

import { initPreviewAction } from "./impl"
import { initPreviewSlipsAction, initPreviewSlipsMaterial } from "./slips/impl"

import { loadDeliverySlipsEventHasDone } from "../load_slips/impl/core"

import { PreviewResource } from "./resource"

import { PreviewSlipsState } from "./slips/action"

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
                                            size: "a4",
                                            type: "御歳暮",
                                        },
                                        printState: "waiting",
                                    },
                                    {
                                        data: {
                                            number: "0002",
                                            name: "山田花子",
                                            size: "b4",
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
                                            size: "a4",
                                            type: "御歳暮",
                                        },
                                        printState: "done",
                                    },
                                    {
                                        data: {
                                            number: "0002",
                                            name: "山田花子",
                                            size: "b4",
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
    return {
        preview: initPreviewAction(
            initPreviewSlipsAction(
                initPreviewSlipsMaterial(
                    newLoadDeliverySlipsInfra(),
                    mockLoadDeliverySlipsLocationDetecter(url),
                ),
            ),
        ),
    }
}

function standard_URL(): URL {
    return new URL("https://example.com/preview.html")
}
function numbered_URL(): URL {
    return new URL("https://example.com/preview.html?number=0002")
}

function slipsActionHasDone(state: PreviewSlipsState): boolean {
    switch (state.type) {
        case "initial-slips":
            return false

        default:
            return loadDeliverySlipsEventHasDone(state)
    }
}
