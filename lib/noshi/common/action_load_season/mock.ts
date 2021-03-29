import { newClock } from "../../../z_vendor/getto-application/infra/clock/init"

import { mockLoadSeasonCoreAction } from "./core/mock"

import { defaultSeason } from "../load_season/impl/converter"

import { LoadSeasonResource } from "./resource"

export function mockLoadSeasonResource(): LoadSeasonResource {
    const clock = newClock()
    return {
        season: mockLoadSeasonCoreAction({ success: true, value: defaultSeason(clock) }),
    }
}
