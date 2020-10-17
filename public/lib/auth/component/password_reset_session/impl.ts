import {
    PasswordResetSessionActionSet,
    PasswordResetSessionComponent,
    PasswordResetSessionState,
    PasswordResetSessionRequest,
    PasswordResetSessionFieldComponentSet,
} from "./component"

import { SessionAction } from "../../../password_reset/action"
import { LoginIDFieldAction } from "../../../login_id/field/action"

import { StartSessionEvent, PollingStatusEvent } from "../../../password_reset/data"

type Background = Readonly<{
    session: SessionAction
    field: {
        loginID: LoginIDFieldAction
    }
}>

export function initPasswordResetSession(actions: PasswordResetSessionActionSet, components: PasswordResetSessionFieldComponentSet): PasswordResetSessionComponent {
    return new Component(actions, components)
}

class Component implements PasswordResetSessionComponent {
    background: Background
    components: PasswordResetSessionFieldComponentSet

    listener: Post<PasswordResetSessionState>[] = []

    constructor(actions: PasswordResetSessionActionSet, components: PasswordResetSessionFieldComponentSet) {
        this.background = {
            session: actions.session,
            field: actions.field,
        }

        this.components = components
    }
    mapStartSessionEvent(event: StartSessionEvent): PasswordResetSessionState {
        switch (event.type) {
            case "succeed-to-start-session":
                this.background.session.startPollingStatus(event.sessionID, (event) => {
                    this.post(this.mapPollingStatusEvent(event))
                })
                return { type: "try-to-polling-status" }

            default:
                return event
        }
    }
    mapPollingStatusEvent(event: PollingStatusEvent): PasswordResetSessionState {
        return event
    }

    onStateChange(post: Post<PasswordResetSessionState>): void {
        this.listener.push(post)
    }
    post(state: PasswordResetSessionState): void {
        this.listener.forEach(post => post(state))
    }

    action(request: PasswordResetSessionRequest): void {
        switch (request.type) {
            case "start-session":
                this.background.session.startSession({
                    loginID: this.background.field.loginID.validate(),
                }, (event) => {
                    this.post(this.mapStartSessionEvent(event))
                })
                return
        }
    }
}

interface Post<T> {
    (state: T): void
}
