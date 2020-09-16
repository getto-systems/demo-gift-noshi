import {
    LoginIDFieldAction,
    LoginIDField,
    LoginIDFieldEventPublisher,
    LoginIDFieldEventSubscriber,
} from "../action"

import { LoginIDFieldEvent, LoginIDFieldError } from "../data"
import { LoginID } from "../../../credential/data"
import { InputValue, Content, validContent, invalidContent, Valid, hasError } from "../../../input/data"

export function initLoginIDFieldAction(): LoginIDFieldAction {
    return new Action()
}

class Action implements LoginIDFieldAction {
    initLoginIDField(): [LoginIDField, LoginIDFieldEventSubscriber] {
        const pubsub = new FieldEventPubSub()
        return [new Field(pubsub), pubsub]
    }
}

class Field implements LoginIDField {
    pub: LoginIDFieldEventPublisher

    loginID: InputValue

    constructor(pub: LoginIDFieldEventPublisher) {
        this.pub = pub

        this.loginID = { inputValue: "" }
    }

    set(input: InputValue): void {
        this.loginID = input
        this.validate()
    }
    validate(): void {
        const [content, result] = this.content()
        this.pub.publishLoginIDFieldEvent({ type: "succeed-to-update-login-id", result, content })
    }

    content(): [Content<LoginID>, Valid<LoginIDFieldError>] {
        const result = hasError(validateLoginID(this.loginID.inputValue))
        if (!result.valid) {
            return [invalidContent(this.loginID), result]
        }
        return [validContent(this.loginID, { loginID: this.loginID.inputValue }), result]
    }
}

class FieldEventPubSub implements LoginIDFieldEventPublisher, LoginIDFieldEventSubscriber {
    holder: {
        field: PublisherHolder<LoginIDFieldEvent>
        content: PublisherHolder<Content<LoginID>>
    }

    constructor() {
        this.holder = {
            field: { set: false },
            content: { set: false },
        }
    }

    onLoginIDFieldStateChanged(pub: Publisher<LoginIDFieldEvent>): void {
        this.holder.field = { set: true, pub }
    }
    onLoginIDFieldContentChanged(pub: Publisher<Content<LoginID>>): void {
        this.holder.content = { set: true, pub }
    }

    publishLoginIDFieldEvent(event: LoginIDFieldEvent): void {
        if (this.holder.field.set) {
            this.holder.field.pub(event)
        }
        if (this.holder.content.set) {
            this.holder.content.pub(event.content)
        }
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}

const ERROR: {
    ok: Array<LoginIDFieldError>,
    empty: Array<LoginIDFieldError>,
} = {
    ok: [],
    empty: ["empty"],
}

function validateLoginID(loginID: string): Array<LoginIDFieldError> {
    if (loginID.length === 0) {
        return ERROR.empty
    }

    return ERROR.ok
}
