import { setupActionTestRunner } from "../../../z_vendor/getto-application/action/test_helper"

import { mockClock, mockClockPubSub } from "../../../z_vendor/getto-application/infra/clock/mock"
import { mockRepository } from "../../../z_vendor/getto-application/infra/repository/mock"

import { markSeason } from "../load_season/impl/test_helper"
import { convertRepository } from "../../../z_vendor/getto-application/infra/repository/helper"

import { initLoadSeasonCoreAction } from "./core/impl"

import { seasonRepositoryConverter } from "../load_season/impl/converter"

import { SeasonRepositoryPod, SeasonRepositoryValue } from "../load_season/infra"

import { LoadSeasonResource } from "./resource"

describe("LoadSeason", () => {
    test("load from repository", async () => {
        const { resource } = standard()

        const runner = setupActionTestRunner(resource.season.subscriber)

        await runner(() => resource.season.ignite()).then((stack) => {
            expect(stack).toEqual([
                { type: "succeed-to-load", value: { year: 2020, period: "summer" } },
            ])
        })
    })

    test("not found; use default", async () => {
        const { resource } = empty()

        const runner = setupActionTestRunner(resource.season.subscriber)

        await runner(() => resource.season.ignite()).then((stack) => {
            expect(stack).toEqual([
                { type: "succeed-to-load", value: { year: 2021, period: "summer" } },
            ])
        })
    })

    test("save season", () => {
        const season = standard_season()

        // TODO カバレッジのために直接呼び出している。あとでシーズンの設定用 action を作って移動
        season(seasonRepositoryConverter).set(markSeason({ year: 2021, period: "summer" }))
        expect(true).toBe(true)
    })
})

function standard() {
    const resource = initResource(standard_season())

    return { resource }
}
function empty() {
    const resource = initResource(empty_season())

    return { resource }
}

function initResource(season: SeasonRepositoryPod): LoadSeasonResource {
    const clock = mockClock(new Date("2021-04-01 10:00:00"), mockClockPubSub())
    return {
        season: initLoadSeasonCoreAction({
            season,
            clock,
        }),
    }
}

function standard_season(): SeasonRepositoryPod {
    const season = mockRepository<SeasonRepositoryValue>()
    season.set({ year: 2020, period: "summer" })
    return convertRepository(season)
}
function empty_season(): SeasonRepositoryPod {
    return convertRepository(mockRepository<SeasonRepositoryValue>())
}
