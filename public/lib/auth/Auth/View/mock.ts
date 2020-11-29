import { newAppHref } from "../../Href/main"

import { newRenewCredentialComponent } from "../renew_credential/mock"

import { newPasswordLoginComponent } from "../password_login/mock"
import { newPasswordResetSessionComponent } from "../password_reset_session/mock"
import { newPasswordResetComponent } from "../password_reset/mock"

import { newLoginIDFieldComponent, LoginIDFieldStateFactory } from "../field/login_id/mock"
import { newPasswordFieldComponent, PasswordFieldStateFactory } from "../field/password/mock"

import { AuthFactory, AuthView, AuthState } from "./view"

export function newAuthAsMock(): AuthFactory {
    return () => {
        return {
            view: new View(new AuthStateFactory().renewCredential()),
            terminate: () => {
                // mock では特に何もしない
            },
        }
    }
}

class AuthStateFactory {
    renewCredential(): AuthState {
        return {
            type: "renew-credential",
            components: {
                renewCredential: newRenewCredentialComponent(),
            },
        }
    }

    passwordLogin(): AuthState {
        return {
            type: "password-login",
            components: {
                href: newAppHref(),
                passwordLogin: newPasswordLoginComponent(),
                loginIDField: newLoginIDFieldComponent(new LoginIDFieldStateFactory().empty()),
                passwordField: newPasswordFieldComponent(new PasswordFieldStateFactory().empty()),
            },
        }
    }
    passwordResetSession(): AuthState {
        return {
            type: "password-reset-session",
            components: {
                href: newAppHref(),
                passwordResetSession: newPasswordResetSessionComponent(),
                loginIDField: newLoginIDFieldComponent(new LoginIDFieldStateFactory().empty()),
            },
        }
    }
    passwordReset(): AuthState {
        return {
            type: "password-reset",
            components: {
                href: newAppHref(),
                passwordReset: newPasswordResetComponent(),
                loginIDField: newLoginIDFieldComponent(new LoginIDFieldStateFactory().empty()),
                passwordField: newPasswordFieldComponent(new PasswordFieldStateFactory().empty()),
            },
        }
    }

    error(err: string): AuthState {
        return { type: "error", err }
    }
}

class View implements AuthView {
    state: AuthState

    constructor(state: AuthState) {
        this.state = state
    }

    onStateChange(post: Post<AuthState>): void {
        post(this.state)
    }

    load(): void {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
