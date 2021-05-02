import { setupSyncActionTestRunner } from "../../z_vendor/getto-application/action/test_helper_legacy"

import { mockBaseResource } from "../action_base/mock"

import { initDashboardView } from "./impl"

describe("Dashboard", () => {
    test("terminate", () =>
        new Promise<void>((done) => {
            const { view } = standard()

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

function standard() {
    const view = initView()

    return { view }
}

function initView() {
    return initDashboardView(mockBaseResource())
}
