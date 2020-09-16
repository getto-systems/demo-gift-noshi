import { StoreCredentialComponentAction } from "../action"

import { StoreCredentialComponent, StoreCredentialComponentState, StoreCredentialComponentEventHandler } from "../data"

import { AuthCredential, FetchEvent, StoreEvent } from "../../../credential/data"

export function initStoreCredentialComponent(
    handler: StoreCredentialComponentEventHandler,
    action: StoreCredentialComponentAction,
): StoreCredentialComponent {
    return new Component(handler, action)
}
export function initStoreCredentialComponentEventHandler(): StoreCredentialComponentEventHandler {
    return new ComponentEventHandler()
}

class Component implements StoreCredentialComponent {
    holder: PublisherHolder<StoreCredentialComponentState>
    handler: StoreCredentialComponentEventHandler
    action: StoreCredentialComponentAction

    constructor(handler: StoreCredentialComponentEventHandler, action: StoreCredentialComponentAction) {
        this.holder = { set: false }
        this.handler = handler
        this.action = action
    }

    hook(pub: Publisher<StoreCredentialComponentState>): void {
        this.holder = { set: true, pub }
    }
    init(stateChanged: Publisher<StoreCredentialComponentState>): void {
        this.handler.onStateChange((state) => {
            if (this.holder.set) {
                this.holder.pub(state)
            }
            stateChanged(state)
        })
    }
    terminate(): void {
        // terminate が必要な component とインターフェイスを合わせるために必要
    }
    store(authCredential: AuthCredential): Promise<void> {
        return this.action.credential.store(authCredential)
    }
}

class ComponentEventHandler implements StoreCredentialComponentEventHandler {
    holder: PublisherHolder<StoreCredentialComponentState>

    constructor() {
        this.holder = { set: false }
    }

    onStateChange(pub: Publisher<StoreCredentialComponentState>): void {
        this.holder = { set: true, pub }
    }

    handleFetchEvent(_event: FetchEvent): void {
        // StoreComponent ではこのイベントは発生しない
    }
    handleStoreEvent(event: StoreEvent): void {
        this.publish(event)
    }

    publish(state: StoreCredentialComponentState): void {
        if (this.holder.set) {
            this.holder.pub(state)
        }
    }
}

type PublisherHolder<T> =
    Readonly<{ set: false }> |
    Readonly<{ set: true, pub: Publisher<T> }>

interface Publisher<T> {
    (state: T): void
}
