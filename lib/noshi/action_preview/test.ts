import { setupActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"

import { standard_DeliverySlips } from "../slip/test_helper"

import { mockLoadDeliverySlipsLocationDetecter } from "../load_slips/impl/mock"

import { initPreviewAction } from "./impl"
import { initPreviewCoreAction, initPreviewCoreMaterial } from "./core/impl"
import { initPreviewSlipsAction, initPreviewSlipsMaterial } from "./slips/impl"

import { DeliverySlipSheet } from "../print_slips/infra"

import { PreviewResource } from "./resource"

describe("Preview", () => {
    test("load slips", async () => {
        const { resource } = standard()

        const runner = setupActionTestRunner(resource.preview.slips.subscriber)

        await runner(() => resource.preview.slips.ignite()).then((stack) => {
            expect(stack).toEqual([
                {
                    type: "succeed-to-load",
                    slips: [
                        {
                            data: { number: "0001", name: "鈴木一郎", size: "A4", type: "御歳暮" },
                            printState: "working",
                            href: "?number=0001",
                        },
                        {
                            data: { number: "0002", name: "山田花子", size: "A3", type: "内　祝" },
                            printState: "waiting",
                            href: "?number=0002",
                        },
                    ],
                },
            ])
        })
    })

    test("load slips; numbered", async () => {
        const { resource } = numbered()

        const runner = setupActionTestRunner(resource.preview.slips.subscriber)

        await runner(() => resource.preview.slips.ignite()).then((stack) => {
            expect(stack).toEqual([
                {
                    type: "succeed-to-load",
                    slips: [
                        {
                            data: { number: "0001", name: "鈴木一郎", size: "A4", type: "御歳暮" },
                            printState: "done",
                            href: "?number=0001",
                        },
                        {
                            data: { number: "0002", name: "山田花子", size: "A3", type: "内　祝" },
                            printState: "working",
                            href: "?number=0002",
                        },
                    ],
                },
            ])
        })
    })

    test("load slip", async () => {
        const { resource } = standard()

        const runner = setupActionTestRunner(resource.preview.core.subscriber)

        await runner(() => resource.preview.core.ignite()).then((stack) => {
            expect(stack).toEqual([
                {
                    type: "succeed-to-load",
                    slip: { number: "0001", name: "鈴木一郎", size: "A4", type: "御歳暮" },
                    next: { hasNext: true, href: "?number=0002" },
                },
            ])
        })
    })

    test("load slip; numbered", async () => {
        const { resource } = numbered()

        const runner = setupActionTestRunner(resource.preview.core.subscriber)

        await runner(() => resource.preview.core.ignite()).then((stack) => {
            expect(stack).toEqual([
                {
                    type: "succeed-to-load",
                    slip: { number: "0002", name: "山田花子", size: "A3", type: "内　祝" },
                    next: { hasNext: false },
                },
            ])
        })
    })

    test("print slips", async () => {
        const { resource } = standard()

        const runner = setupActionTestRunner(resource.preview.core.subscriber)

        await runner(() => resource.preview.core.print()).then((stack) => {
            expect(stack).toEqual([
                { type: "try-to-print" },
                { type: "succeed-to-print", href: "#object-url" },
            ])
        })
    })
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
