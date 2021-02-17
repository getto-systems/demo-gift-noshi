import { newRenewAuthnInfoInfra } from "../../../kernel/authnInfo/renew/main"
import { newStartContinuousRenewAuthnInfoInfra } from "../../../kernel/authnInfo/startContinuousRenew/main"
import {
    newGetSecureScriptPathLocationInfo,
    newGetSecureScriptPathInfra,
} from "../../../secureScriptPath/get/main"

import { initRenewAuthnInfoAction } from "./impl"

import { RenewAuthnInfoAction } from "./action"

export function newRenewAuthnInfoAction(webStorage: Storage): RenewAuthnInfoAction {
    return initRenewAuthnInfoAction(
        {
            renew: newRenewAuthnInfoInfra(webStorage),
            startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
            getSecureScriptPath: newGetSecureScriptPathInfra(),
        },
        newGetSecureScriptPathLocationInfo()
    )
}
