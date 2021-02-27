import { env } from "../../../../../y_environment/env"

import { initApiAuthSignResetRegister } from "../../../../../z_external/api/auth/sign/reset/register"

import { initResetConnect } from "./infra/remote/reset/connect"

import { initResetLocationInfo } from "./impl"

import { delaySecond } from "../../../../../z_vendor/getto-application/infra/config/infra"
import { ResetInfra } from "./infra"

import { ResetLocationInfo } from "./method"

export function newResetLocationInfo(currentLocation: Location): ResetLocationInfo {
    return initResetLocationInfo(new URL(currentLocation.toString()))
}

export function newResetInfra(): ResetInfra {
    return {
        reset: initResetConnect(initApiAuthSignResetRegister(env.apiServerURL)),
        config: {
            delay: delaySecond(1),
        },
    }
}
