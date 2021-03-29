import { newLoadSeasonInfra } from "../load_season/impl/init"
import { initLoadSeasonCoreAction } from "./core/impl"
import { LoadSeasonResource } from "./resource"

type OutsideFeature = Readonly<{
    webStorage: Storage
}>
export function newLoadSeasonResource(feature: OutsideFeature): LoadSeasonResource {
    const { webStorage } = feature
    return {
        season: initLoadSeasonCoreAction(newLoadSeasonInfra(webStorage)),
    }
}
