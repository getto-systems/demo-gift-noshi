import { newResetLocationDetecter } from "../../../init"
import { newGetScriptPathLocationDetecter } from "../../../../../../common/secure/getScriptPath/impl/init"

import { newCoreBackgroundInfra } from "./worker/background"
import { newCoreForegroundInfra } from "./worker/foreground"

import {
    initCoreBackgroundMaterial,
    initCoreBackgroundMaterialPod,
    initCoreForegroundMaterial,
} from "../Core/impl"

import {
    CoreBackgroundMaterial,
    CoreBackgroundMaterialPod,
    CoreForegroundMaterial,
} from "../Core/action"

export function newCoreForegroundMaterial(
    webStorage: Storage,
    currentLocation: Location,
): CoreForegroundMaterial {
    const infra = newCoreForegroundInfra(webStorage)
    return initCoreForegroundMaterial(infra, {
        getSecureScriptPath: newGetScriptPathLocationDetecter(currentLocation),
    })
}

export function newCoreBackgroundPod(): CoreBackgroundMaterialPod {
    return initCoreBackgroundMaterialPod(newCoreBackgroundInfra())
}
export function newCoreBackgroundMaterial(currentLocation: Location): CoreBackgroundMaterial {
    const infra = newCoreBackgroundInfra()
    return initCoreBackgroundMaterial(infra, {
        reset: newResetLocationDetecter(currentLocation),
    })
}
