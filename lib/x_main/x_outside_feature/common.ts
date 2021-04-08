import { RepositoryOutsideFeature } from "../../z_vendor/getto-application/infra/repository/infra"
import { LocationOutsideFeature } from "../../z_vendor/getto-application/location/infra"

export type ForegroundOutsideFeature = CommonOutsideFeature & LocationOutsideFeature

export type CommonOutsideFeature = RepositoryOutsideFeature

export function foregroundOutsideFeature(): ForegroundOutsideFeature {
    return {
        ...commonOutsideFeature(),
        currentLocation: location,
    }
}

export function commonOutsideFeature(): CommonOutsideFeature {
    return {
        webDB: indexedDB,
    }
}
