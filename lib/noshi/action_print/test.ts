import { setupSyncActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"

import { mockPrintResource } from "./mock"

import { initPrintView } from "./impl"

describe("Print", () => {
    test("terminate", () =>
        new Promise<void>((done) => {
            const { view } = standard()

            const runner = setupSyncActionTestRunner([
                {
                    statement: (check) => {
                        view.terminate()
                        view.resource.preview.slips.ignite()

                        setTimeout(check, 256) // wait for events.
                    },
                    examine: (stack) => {
                        // no event after terminate
                        expect(stack).toEqual([])
                    },
                },
            ])

            view.resource.preview.slips.subscriber.subscribe(runner(done))
        }))
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
