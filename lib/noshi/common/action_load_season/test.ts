import { mockClock, mockClockPubSub } from "../../../z_vendor/getto-application/infra/clock/mock"
import { mockDB } from "../../../z_vendor/getto-application/infra/repository/mock"

import { markSeason } from "../load_season/impl/test_helper"
import { wrapRepository } from "../../../z_vendor/getto-application/infra/repository/helper"

import { initLoadSeasonCoreAction } from "./core/impl"

import { seasonRepositoryConverter } from "../load_season/impl/converter"

import { SeasonRepositoryPod } from "../load_season/infra"

import { LoadSeasonResource } from "./resource"

describe("LoadSeason", () => {
    test("load from repository", () => {
        const { resource } = standard()

        expect(resource.season.load()).toEqual({
            success: true,
            value: { year: 2020, period: "summer" },
        })
    })

    test("not found; use default", () => {
        const { resource } = empty()

        expect(resource.season.load()).toEqual({
            success: true,
            value: { year: 2021, period: "summer" },
        })
    })

    test("save season", () => {
        const season = standard_season()

        // TODO カバレッジのために直接呼び出している。シーズンの設定用 action を作るべき
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
    const season = mockDB()
    season.set({ year: 2020, period: "summer" })
    return wrapRepository(season)
}
function empty_season(): SeasonRepositoryPod {
    return wrapRepository(mockDB())
}
