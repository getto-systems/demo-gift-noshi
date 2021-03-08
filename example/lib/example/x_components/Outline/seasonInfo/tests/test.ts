import { newTestSeasonInfoComponent, SeasonInfoRepository } from "./core"

import { initStaticClock, staticClockPubSub } from "../../../../../z_vendor/getto-application/infra/clock/simulate"
import { initMemorySeasonRepository } from "../../../../common/season/impl/repository/season/memory"

import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"

import { SeasonInfoComponentState } from "../component"

import { markSeason } from "../../../../common/season/data"

// デフォルトの season を取得する
const NOW = new Date("2021-01-01 10:00:00")

describe("SeasonInfo", () => {
    test("load from repository", (done) => {
        const { seasonInfo } = standardSeasonInfoComponent()

        seasonInfo.subscriber.subscribe(stateHandler())

        seasonInfo.ignite()

        function stateHandler(): Post<SeasonInfoComponentState> {
            const stack: SeasonInfoComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-season":
                        // work in progress...
                        break

                    case "succeed-to-load":
                        expect(stack).toEqual([{ type: "succeed-to-load", season: { year: 2020 } }])
                        done()
                        break

                    case "failed-to-load":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("not found; use default", (done) => {
        const { seasonInfo } = emptySeasonInfoComponent()

        seasonInfo.subscriber.subscribe(stateHandler())

        seasonInfo.ignite()

        function stateHandler(): Post<SeasonInfoComponentState> {
            const stack: SeasonInfoComponentState[] = []

            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-season":
                        // work in progress...
                        break

                    case "succeed-to-load":
                        expect(stack).toEqual([{ type: "succeed-to-load", season: { year: 2021 } }])
                        done()
                        break

                    case "failed-to-load":
                        done(new Error(state.type))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })
})

function standardSeasonInfoComponent() {
    const repository = standardRepository()
    const clock = standardClock()
    const seasonInfo = newTestSeasonInfoComponent(repository, clock)

    return { seasonInfo }
}
function emptySeasonInfoComponent() {
    const repository = emptyRepository()
    const clock = standardClock()
    const seasonInfo = newTestSeasonInfoComponent(repository, clock)

    return { seasonInfo }
}

function standardRepository(): SeasonInfoRepository {
    return {
        seasons: initMemorySeasonRepository({
            stored: true,
            season: markSeason({ year: 2020 }),
        }),
    }
}
function emptyRepository(): SeasonInfoRepository {
    return {
        seasons: initMemorySeasonRepository({ stored: false }),
    }
}

function standardClock(): Clock {
    return initStaticClock(NOW, staticClockPubSub())
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
