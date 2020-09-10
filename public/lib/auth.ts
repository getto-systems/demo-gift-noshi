import { AuthAction, AuthEvent, AuthError } from "./auth/action";

import { RenewComponent, initRenew } from "./auth/renew";
import { LoadApplicationComponent, initLoadApplication } from "./auth/load_application";

import { PasswordLoginComponent, initPasswordLogin } from "./auth/password_login";
import { PasswordResetSessionComponent, initPasswordResetSession } from "./auth/password_reset_session";
import { PasswordResetComponent, initPasswordReset } from "./auth/password_reset";

export interface AuthUsecase {
    initialState(): AuthState
    onStateChange(stateChanged: AuthEventHandler): void
}

export type AuthState =
    Readonly<{ type: "renew", component: RenewComponent }> |
    Readonly<{ type: "load-application", component: LoadApplicationComponent }> |
    Readonly<{ type: "password-login", component: PasswordLoginComponent }> |
    Readonly<{ type: "password-reset-session", component: PasswordResetSessionComponent }> |
    Readonly<{ type: "password-reset", component: PasswordResetComponent }> |
    Readonly<{ type: "error", err: AuthError }>

export interface AuthEventHandler {
    (state: AuthState): void
}

export function initAuthUsecase(url: Readonly<URL>, action: AuthAction): AuthUsecase {
    return new Usecase(url, action);
}

class Usecase implements AuthUsecase {
    url: Readonly<URL>
    action: AuthAction

    eventHolder: EventHolder<UsecaseEvent>

    constructor(url: Readonly<URL>, action: AuthAction) {
        this.url = url;
        this.action = action;
        this.eventHolder = { hasEvent: false }
    }

    initialState(): AuthState {
        return { type: "renew", component: initRenew(this.action, this.event()) }
    }

    onStateChange(stateChanged: AuthEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new UsecaseEvent(stateChanged, this.url, this.action) }
    }
    event(): AuthEvent {
        return unwrap(this.eventHolder);
    }
}

class UsecaseEvent implements AuthEvent {
    stateChanged: AuthEventHandler
    url: Readonly<URL>
    action: AuthAction

    constructor(stateChanged: AuthEventHandler, url: Readonly<URL>, action: AuthAction) {
        this.stateChanged = stateChanged;
        this.url = url;
        this.action = action;
    }

    tryToLogin(): void {
        // ログイン前画面ではアンダースコアで始まる query string を使用する
        if (this.url.searchParams.get("_password_reset_session")) {
            this.stateChanged({ type: "password-reset-session", component: initPasswordResetSession(this.action) });
            return;
        }

        const resetToken = this.url.searchParams.get("_password_reset_token");
        if (resetToken) {
            this.stateChanged({ type: "password-reset", component: initPasswordReset(this.action, this, { resetToken }) });
            return;
        }

        // 特に指定が無ければパスワードログイン
        this.stateChanged({ type: "password-login", component: initPasswordLogin(this.action, this) });
    }
    failedToAuth(err: AuthError): void {
        this.stateChanged({ type: "error", err });
    }
    succeedToAuth(): void {
        this.stateChanged({ type: "load-application", component: initLoadApplication(this.action, this) });
    }
}

type EventHolder<T> =
    Readonly<{ hasEvent: false }> |
    Readonly<{ hasEvent: true, event: T }>
function unwrap<T>(holder: EventHolder<T>): T {
    if (!holder.hasEvent) {
        throw new Error("event is not initialized");
    }
    return holder.event;
}
