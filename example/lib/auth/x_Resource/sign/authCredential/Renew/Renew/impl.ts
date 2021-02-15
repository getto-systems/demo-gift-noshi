import { ApplicationBaseComponent } from "../../../../../../vendor/getto-example/Application/impl"

import {
    RenewAuthCredentialMaterial,
    RenewAuthCredentialComponent,
    RenewAuthCredentialComponentState,
} from "./component"

import { LoadSecureScriptError } from "../../../../../sign/authLocation/data"
import { AuthCredential } from "../../../../../sign/authCredential/common/data"

export function initRenewComponent(material: RenewAuthCredentialMaterial): RenewAuthCredentialComponent {
    return new Component(material)
}

class Component
    extends ApplicationBaseComponent<RenewAuthCredentialComponentState>
    implements RenewAuthCredentialComponent {
    material: RenewAuthCredentialMaterial

    constructor(material: RenewAuthCredentialMaterial) {
        super()
        this.material = material
    }

    request(): void {
        this.material.foreground.renew.request((event) => {
            switch (event.type) {
                case "try-to-instant-load":
                    this.post({ type: "try-to-instant-load", scriptPath: this.secureScriptPath() })
                    return

                case "succeed-to-renew":
                    this.startContinuousRenew(event.authCredential)
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
    succeedToInstantLoad(): void {
        this.material.foreground.continuousRenew.forceStart((event) => {
            this.post(event)
        })
    }
    failedToInstantLoad(): void {
        this.material.foreground.renew.forceRequest((event) => {
            switch (event.type) {
                case "succeed-to-renew":
                    this.startContinuousRenew(event.authCredential)
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
    loadError(err: LoadSecureScriptError): void {
        this.post({ type: "load-error", err })
    }

    secureScriptPath() {
        return this.material.foreground.location.getSecureScriptPath()
    }

    startContinuousRenew(authCredential: AuthCredential) {
        this.material.foreground.continuousRenew.start(authCredential, (event) => {
            switch (event.type) {
                case "succeed-to-start-continuous-renew":
                    this.post({ type: "try-to-load", scriptPath: this.secureScriptPath() })
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
}