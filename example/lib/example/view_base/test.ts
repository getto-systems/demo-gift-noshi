import { initSyncActionTestRunner } from "../../z_vendor/getto-application/action/test_helper"
import { initBaseEntryPoint } from "./impl"

import { standard_MockBaseResource } from "./mock"

describe("Base", () => {
    test("terminate", (done) => {
        const { entryPoint } = standard_elements()

        const runner = initSyncActionTestRunner([
            {
                statement: (check) => {
                    entryPoint.terminate()
                    entryPoint.resource.menu.ignite()

                    setTimeout(check, 256) // wait for events.
                },
                examine: (stack) => {
                    // no event after terminate
                    expect(stack).toEqual([])
                },
            },
        ])

        entryPoint.resource.menu.subscriber.subscribe(runner(done))
    })
})

function standard_elements() {
    const entryPoint = newEntryPoint()

    return { entryPoint }
}

function newEntryPoint() {
    return initBaseEntryPoint(standard_MockBaseResource(), () => null)
}
