import { env } from "../../../y_environment/env"

import { initAuthLocationAction, initAuthLocationActionLocationInfo } from "./impl"

import { AuthLocationAction, AuthLocationActionLocationInfo } from "./action"
import { currentURL } from "../../../z_infra/location/url"

export function newAuthLocationAction(): AuthLocationAction {
    return initAuthLocationAction(
        {
            config: {
                secureServerHost: env.secureServerHost,
            },
        },
        newLocationInfo()
    )
}

function newLocationInfo(): AuthLocationActionLocationInfo {
    return initAuthLocationActionLocationInfo(currentURL())
}
