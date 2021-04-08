import { RepositoryOutsideFeature } from "../../../z_vendor/getto-application/infra/repository/infra"
import { newLoadSeasonInfra } from "../load_season/impl/init"
import { initLoadSeasonCoreAction } from "./core/impl"
import { LoadSeasonResource } from "./resource"

export function newLoadSeasonResource(feature: RepositoryOutsideFeature): LoadSeasonResource {
    return {
        season: initLoadSeasonCoreAction(newLoadSeasonInfra(feature)),
    }
}
