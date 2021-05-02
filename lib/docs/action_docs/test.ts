import { setupSyncActionTestRunner } from "../../z_vendor/getto-application/action/test_helper_legacy"

import { mockDocsResource } from "./mock"

import { initDocsView } from "./impl"

describe("DocsContent", () => {
    test("terminate", () =>
        new Promise<void>((done) => {
            const { view } = standard_elements()

            const runner = setupSyncActionTestRunner([
                {
                    statement: (check) => {
                        view.terminate()
                        view.resource.menu.ignite()

                        setTimeout(check, 256) // wait for events.
                    },
                    examine: (stack) => {
                        // no event after terminate
                        expect(stack).toEqual([])
                    },
                },
            ])

            view.resource.menu.subscriber.subscribe(runner(done))
        }))
})

function standard_elements() {
    const view = initView()

    return { view }
}

function initView() {
    return initDocsView(mockDocsResource())
}
