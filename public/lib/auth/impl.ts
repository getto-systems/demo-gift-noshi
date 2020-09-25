import { initResetToken } from "../password_reset/adapter"

import { AuthUsecase, AuthComponent } from "./usecase"

import { AuthState } from "./data"

import { AuthCredential } from "../credential/data"

export function initAuthUsecase(currentLocation: Location, component: AuthComponent): AuthUsecase {
    return new Usecase(currentLocation, component)
}

class Usecase implements AuthUsecase {
    holder: StateHolder
    component: AuthComponent

    currentLocation: Location

    constructor(currentLocation: Location, component: AuthComponent) {
        this.holder = { set: false, stack: false }
        this.component = component

        this.currentLocation = currentLocation

        this.component.renewCredential.hook((state) => {
            switch (state.type) {
                case "required-to-login":
                    this.tryToLogin()
                    return

                case "succeed-to-store":
                    this.loadApplication()
                    return
            }
        })

        this.component.storeCredential.hook((state) => {
            switch (state.type) {
                case "succeed-to-store":
                    this.loadApplication()
                    return
            }
        })

        this.component.passwordLogin.hook((state) => {
            switch (state.type) {
                case "succeed-to-login":
                    this.storeCredential(state.authCredential)
                    return
            }
        })

        this.component.passwordReset.hook((state) => {
            switch (state.type) {
                case "succeed-to-reset":
                    this.storeCredential(state.authCredential)
                    return
            }
        })
    }

    onStateChange(post: Post<AuthState>): void {
        if (this.holder.stack) {
            post(this.holder.state)
        }
        this.holder = { set: true, stack: false, post }
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }

    post(state: AuthState): void {
        if (this.holder.set) {
            this.holder.post(state)
        } else {
            this.holder = { set: false, stack: true, state }
        }
    }

    async storeCredential(authCredential: AuthCredential): Promise<void> {
        this.post({ type: "store-credential", authCredential })
    }
    async tryToLogin(): Promise<void> {
        this.post(loginState(this.currentLocation))
    }
    async loadApplication(): Promise<void> {
        this.post({ type: "load-application" })
    }
}

function loginState(currentLocation: Location): AuthState {
    // ログイン前画面ではアンダースコアから始まるクエリを使用する
    const url = new URL(currentLocation.toString())

    if (url.searchParams.get("_password_reset") === "start") {
        return { type: "password-reset-session" }
    }

    const resetToken = url.searchParams.get("_password_reset_token")
    if (resetToken) {
        return { type: "password-reset", resetToken: initResetToken(resetToken) }
    }

    // 特に指定が無ければパスワードログイン
    return { type: "password-login" }
}

type StateHolder =
    Readonly<{ set: false, stack: false }> |
    Readonly<{ set: false, stack: true, state: AuthState }> |
    Readonly<{ set: true, stack: false, post: Post<AuthState> }>

interface Post<T> {
    (state: T): void
}
