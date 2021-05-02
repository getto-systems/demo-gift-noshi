import { setupActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"

import { mockPrintResource } from "./mock"

import { initPrintView } from "./impl"

describe("Print", () => {
    test("terminate", async () => {
        const { view } = standard()

        const runner = setupActionTestRunner(view.resource.preview.slips.subscriber)

        await runner(() => {
            view.terminate()
            return view.resource.preview.slips.ignite()
        }).then((stack) => {
            // no event after terminate
            expect(stack).toEqual([])
        })
    })
})

function standard() {
    const view = initView()

    return { view }
}

function initView() {
    return initPrintView(mockPrintResource(standard_URL()))
}

function standard_URL(): URL {
    return new URL("https://example.com/print.html")
}
