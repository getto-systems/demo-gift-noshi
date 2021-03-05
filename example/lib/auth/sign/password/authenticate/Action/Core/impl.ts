import { ApplicationAbstractStateAction } from "../../../../../../z_vendor/getto-application/action/impl"

import {
    saveAuthInfo,
    startContinuousRenew,
} from "../../../../kernel/authInfo/common/startContinuousRenew/impl/core"
import { getScriptPath } from "../../../../common/secure/getScriptPath/impl/core"
import { authenticatePassword } from "../../impl/core"

import { AuthenticatePasswordInfra } from "../../infra"
import { StartContinuousRenewInfra } from "../../../../kernel/authInfo/common/startContinuousRenew/infra"
import { GetScriptPathInfra } from "../../../../common/secure/getScriptPath/infra"

import {
    AuthenticatePasswordCoreMaterial,
    AuthenticatePasswordCoreAction,
    AuthenticatePasswordCoreState,
    AuthenticatePasswordCoreForegroundMaterial,
    AuthenticatePasswordCoreBackgroundMaterial,
    initialAuthenticatePasswordCoreState,
} from "./action"

import { GetScriptPathLocationDetecter } from "../../../../common/secure/getScriptPath/method"

import { LoadScriptError } from "../../../../common/secure/getScriptPath/data"
import { AuthenticatePasswordFields } from "../../data"
import { AuthInfo } from "../../../../kernel/authInfo/kernel/data"
import { ConvertBoardResult } from "../../../../../../z_vendor/getto-application/board/kernel/data"

export type AuthenticatePasswordCoreInfra = AuthenticatePasswordCoreForegroundInfra &
    AuthenticatePasswordCoreBackgroundInfra

export type AuthenticatePasswordCoreForegroundInfra = Readonly<{
    startContinuousRenew: StartContinuousRenewInfra
    getSecureScriptPath: GetScriptPathInfra
}>
export type AuthenticatePasswordCoreBackgroundInfra = Readonly<{
    authenticate: AuthenticatePasswordInfra
}>

export function initAuthenticatePasswordCoreMaterial(
    infra: AuthenticatePasswordCoreInfra,
    locationInfo: GetScriptPathLocationDetecter,
): AuthenticatePasswordCoreMaterial {
    return {
        ...initAuthenticatePasswordCoreForegroundMaterial(infra, locationInfo),
        ...initAuthenticatePasswordCoreBackgroundMaterial(infra),
    }
}
export function initAuthenticatePasswordCoreForegroundMaterial(
    infra: AuthenticatePasswordCoreForegroundInfra,
    locationInfo: GetScriptPathLocationDetecter,
): AuthenticatePasswordCoreForegroundMaterial {
    return {
        saveAuthInfo: saveAuthInfo(infra.startContinuousRenew),
        startContinuousRenew: startContinuousRenew(infra.startContinuousRenew),
        getSecureScriptPath: getScriptPath(infra.getSecureScriptPath)(locationInfo),
    }
}
export function initAuthenticatePasswordCoreBackgroundMaterial(
    infra: AuthenticatePasswordCoreBackgroundInfra,
): AuthenticatePasswordCoreBackgroundMaterial {
    return {
        authenticate: authenticatePassword(infra.authenticate),
    }
}

export function initAuthenticatePasswordCoreAction(
    material: AuthenticatePasswordCoreMaterial,
): AuthenticatePasswordCoreAction {
    return new Action(material)
}

class Action
    extends ApplicationAbstractStateAction<AuthenticatePasswordCoreState>
    implements AuthenticatePasswordCoreAction {
    readonly initialState = initialAuthenticatePasswordCoreState

    material: AuthenticatePasswordCoreMaterial

    constructor(material: AuthenticatePasswordCoreMaterial) {
        super()
        this.material = material
    }

    submit(fields: ConvertBoardResult<AuthenticatePasswordFields>): void {
        this.material.authenticate(fields, (event) => {
            switch (event.type) {
                case "succeed-to-login":
                    this.startContinuousRenew(event.auth)
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
    startContinuousRenew(info: AuthInfo): void {
        const result = this.material.saveAuthInfo(info)
        if (!result.success) {
            this.post({ type: "repository-error", err: result.err })
        }

        this.material.startContinuousRenew((event) => {
            switch (event.type) {
                case "succeed-to-start-continuous-renew":
                    this.post({
                        type: "try-to-load",
                        scriptPath: this.secureScriptPath(),
                    })
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }

    loadError(err: LoadScriptError): void {
        this.post({ type: "load-error", err })
    }

    secureScriptPath() {
        return this.material.getSecureScriptPath()
    }
}
