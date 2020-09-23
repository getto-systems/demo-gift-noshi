import { PasswordFieldOperation, PasswordFieldEvent } from "./data"
import { InputValue } from "../../field/data"

export interface PasswordFieldAction {
    initPasswordField(): PasswordField
}

export interface PasswordField {
    sub: PasswordFieldEventSubscriber
    trigger(operation: PasswordFieldOperation): void
    set(input: InputValue): void
    show(): void
    hide(): void
    validate(): void
}

export interface PasswordFieldEventPublisher {
    dispatchPasswordFieldEvent(event: PasswordFieldEvent): void
}

export interface PasswordFieldEventSubscriber {
    onPasswordFieldEvent(dispatch: Dispatcher<PasswordFieldEvent>): void
}

interface Dispatcher<T> {
    (state: T): void
}
