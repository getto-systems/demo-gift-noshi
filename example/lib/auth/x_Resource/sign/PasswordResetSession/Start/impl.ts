import { ApplicationBaseComponent } from "../../../../../vendor/getto-example/Application/impl"

import {
    StartComponentFactory,
    StartMaterial,
    StartComponent,
    StartComponentState,
} from "./component"

import { PasswordResetSessionID, PasswordResetSessionFields } from "../../../../sign/password/reset/session/data"
import { FormConvertResult } from "../../../../../vendor/getto-form/form/data"

export const initStartComponent: StartComponentFactory = (material) => new Component(material)

class Component extends ApplicationBaseComponent<StartComponentState> implements StartComponent {
    material: StartMaterial

    constructor(material: StartMaterial) {
        super()
        this.material = material
    }

    submit(fields: FormConvertResult<PasswordResetSessionFields>): void {
        this.material.session.start(fields, (event) => {
            switch (event.type) {
                case "succeed-to-start-session":
                    this.checkStatus(event.sessionID)
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }

    checkStatus(sessionID: PasswordResetSessionID): void {
        this.material.session.checkStatus(sessionID, (event) => {
            this.post(event)
        })
    }
}