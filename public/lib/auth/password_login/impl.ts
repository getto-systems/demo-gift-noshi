import {
    PasswordLoginComponentAction,
    PasswordLoginComponent,
    PasswordLoginWorkerComponentHelper,
} from "./component"

import {
    PasswordLoginComponentState,
    PasswordLoginComponentOperation,
    PasswordLoginWorkerComponentState,
} from "./data"

import { LoginIDFieldComponentState } from "../field/login_id/data"
import { PasswordFieldComponentState } from "../field/password/data"

import { LoginIDField } from "../../field/login_id/action"
import { PasswordField } from "../../field/password/action"

import { LoginID } from "../../login_id/data"
import { Password } from "../../password/data"
import { LoginEvent } from "../../password_login/data"
import { Content } from "../../field/data"

export function initPasswordLoginComponent(action: PasswordLoginComponentAction): PasswordLoginComponent {
    return new Component(action)
}
export function initPasswordLoginWorkerComponent(init: WorkerInit): PasswordLoginComponent {
    return new WorkerComponent(init)
}
export function initPasswordLoginWorkerComponentHelper(): PasswordLoginWorkerComponentHelper {
    return {
        mapPasswordLoginComponentState,
        mapLoginIDFieldComponentState,
        mapPasswordFieldComponentState,
    }
}

class Component implements PasswordLoginComponent {
    action: PasswordLoginComponentAction

    holder: PublisherHolder<PasswordLoginComponentState>

    field: {
        loginID: LoginIDField
        password: PasswordField
    }

    content: {
        loginID: Content<LoginID>
        password: Content<Password>
    }

    constructor(action: PasswordLoginComponentAction) {
        this.action = action

        this.holder = { set: false }

        this.field = {
            loginID: this.action.loginIDField.initLoginIDField(),
            password: this.action.passwordField.initPasswordField(),
        }

        this.content = {
            loginID: { input: { inputValue: "" }, valid: false },
            password: { input: { inputValue: "" }, valid: false },
        }

        this.field.loginID.sub.onLoginIDFieldContentChanged((content: Content<LoginID>) => {
            this.content.loginID = content
        })
        this.field.password.sub.onPasswordFieldContentChanged((content: Content<Password>) => {
            this.content.password = content
        })
    }

    hook(pub: Publisher<PasswordLoginComponentState>): void {
        this.holder = { set: true, pub }
    }
    init(stateChanged: Publisher<PasswordLoginComponentState>): void {
        this.action.passwordLogin.sub.onLoginEvent((event) => {
            const state = map(event)
            if (this.holder.set) {
                this.holder.pub(state)
            }
            stateChanged(state)

            function map(event: LoginEvent): PasswordLoginComponentState {
                return event
            }
        })
    }
    initLoginIDField(stateChanged: Publisher<LoginIDFieldComponentState>): void {
        this.field.loginID.sub.onLoginIDFieldStateChanged(stateChanged)
    }
    initPasswordField(stateChanged: Publisher<PasswordFieldComponentState>): void {
        this.field.password.sub.onPasswordFieldStateChanged(stateChanged)
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
    trigger(operation: PasswordLoginComponentOperation): Promise<void> {
        switch (operation.type) {
            case "login":
                return this.login()

            case "field-login_id":
                return Promise.resolve(this.field.loginID.trigger(operation.operation))

            case "field-password":
                return Promise.resolve(this.field.password.trigger(operation.operation))
        }
    }

    login(): Promise<void> {
        this.field.loginID.validate()
        this.field.password.validate()

        return this.action.passwordLogin.login([
            this.content.loginID,
            this.content.password,
        ])
    }
}

class WorkerComponent implements PasswordLoginComponent {
    worker: WorkerHolder
    holder: PublisherHolder<PasswordLoginComponentState>

    constructor(init: WorkerInit) {
        this.worker = { set: false, init }
        this.holder = { set: false }
    }

    hook(pub: Publisher<PasswordLoginComponentState>): void {
        this.holder = { set: true, pub }
    }
    init(stateChanged: Publisher<PasswordLoginComponentState>): void {
        if (!this.worker.set) {
            this.worker = {
                set: true,
                instance: this.initWorker(this.worker.init, (state) => {
                    if (this.holder.set) {
                        this.holder.pub(state)
                    }
                    stateChanged(state)
                }),
            }
        }
    }
    initWorker(init: WorkerInit, stateChanged: Publisher<PasswordLoginComponentState>): Worker {
        const worker = init()
        worker.addEventListener("message", (event) => {
            const state = event.data as PasswordLoginWorkerComponentState
            if (state.type === "password_login") {
                stateChanged(state.state)
            }
        })
        return worker
    }

    initLoginIDField(stateChanged: Publisher<LoginIDFieldComponentState>): void {
        if (this.worker.set) {
            this.worker.instance.addEventListener("message", (event) => {
                const state = event.data as PasswordLoginWorkerComponentState
                if (state.type === "field-login_id") {
                    stateChanged(state.state)
                }
            })
        }
    }
    initPasswordField(stateChanged: Publisher<PasswordFieldComponentState>): void {
        if (this.worker.set) {
            this.worker.instance.addEventListener("message", (event) => {
                const state = event.data as PasswordLoginWorkerComponentState
                if (state.type === "field-password") {
                    stateChanged(state.state)
                }
            })
        }
    }

    terminate(): void {
        if (this.worker.set) {
            this.worker.instance.terminate()
        }
    }

    async trigger(operation: PasswordLoginComponentOperation): Promise<void> {
        if (this.worker.set) {
            this.worker.instance.postMessage(operation)
        }
    }
}

function mapPasswordLoginComponentState(state: PasswordLoginComponentState): PasswordLoginWorkerComponentState {
    return { type: "password_login", state }
}
function mapLoginIDFieldComponentState(state: LoginIDFieldComponentState): PasswordLoginWorkerComponentState {
    return { type: "field-login_id", state }
}
function mapPasswordFieldComponentState(state: PasswordFieldComponentState): PasswordLoginWorkerComponentState {
    return { type: "field-password", state }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}

type WorkerHolder =
    Readonly<{ set: false, init: WorkerInit }> |
    Readonly<{ set: true, instance: Worker }>

interface WorkerInit {
    (): Worker
}