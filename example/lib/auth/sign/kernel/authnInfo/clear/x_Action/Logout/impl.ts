import { ApplicationAbstractAction } from "../../../../../../../z_getto/application/impl"

import { clearAuthnInfo } from "../../impl"

import { ClearAuthnInfoInfra } from "../../infra"

import { LogoutAction, LogoutState, LogoutMaterial } from "./action"

export function initClearAuthnInfoAction(infra: ClearAuthnInfoInfra): LogoutAction {
    return new Action({
        clear: clearAuthnInfo(infra),
    })
}

class Action extends ApplicationAbstractAction<LogoutState> implements LogoutAction {
    material: LogoutMaterial

    constructor(material: LogoutMaterial) {
        super()
        this.material = material
    }

    submit(): void {
        this.material.clear(this.post)
    }
}
