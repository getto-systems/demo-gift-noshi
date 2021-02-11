import { ApplicationBaseComponent } from "../../../../../sub/getto-example/x_components/Application/impl"

import {
    LoginView,
    LoginState,
    ViewState,
    RenewCredentialResource,
    PasswordLoginResource,
    PasswordResetSessionResource,
    PasswordResetResource,
} from "../entryPoint"

import { RenewCredentialComponent } from "../../renewCredential/component"

export class View extends ApplicationBaseComponent<LoginState> implements LoginView {
    locationInfo: LoginViewLocationInfo
    components: LoginResourceFactory

    constructor(locationInfo: LoginViewLocationInfo, components: LoginResourceFactory) {
        super()
        this.locationInfo = locationInfo
        this.components = components
    }

    load(): void {
        this.post({
            type: "renew-credential",
            resource: this.components.renewCredential((renewCredential) => {
                this.hookCredentialStateChange(renewCredential)
            }),
        })
    }
    error(err: string): void {
        this.post({ type: "error", err })
    }

    hookCredentialStateChange(renewCredential: RenewCredentialComponent): void {
        renewCredential.addStateHandler((state) => {
            switch (state.type) {
                case "required-to-login":
                    this.post(this.mapLoginView(this.locationInfo.login.getLoginView()))
                    return
            }
        })
    }
    mapLoginView(loginView: ViewState): LoginState {
        switch (loginView) {
            case "password-login":
                return { type: loginView, resource: this.components.passwordLogin() }
            case "password-reset-session":
                return { type: loginView, resource: this.components.passwordResetSession() }
            case "password-reset":
                return { type: loginView, resource: this.components.passwordReset() }
        }
    }
}

export interface LoginResourceFactory {
    renewCredential(setup: Setup<RenewCredentialComponent>): RenewCredentialResource

    passwordLogin(): PasswordLoginResource
    passwordResetSession(): PasswordResetSessionResource
    passwordReset(): PasswordResetResource
}
export interface LoginViewLocationInfo {
    login: Readonly<{
        getLoginView(): ViewState
    }>
}

interface Setup<T> {
    (component: T): void
}