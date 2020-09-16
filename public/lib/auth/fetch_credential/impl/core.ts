import { FetchCredentialComponentAction } from "../action"

import { FetchCredentialComponent, FetchCredentialComponentState, FetchCredentialComponentEventHandler } from "../data"

import { FetchEvent, StoreEvent } from "../../../credential/data"

export function initFetchCredentialComponent(
    handler: FetchCredentialComponentEventHandler,
    action: FetchCredentialComponentAction,
): FetchCredentialComponent {
    return new Component(handler, action)
}
export function initFetchCredentialComponentEventHandler(): FetchCredentialComponentEventHandler {
    return new ComponentEventHandler()
}

class Component implements FetchCredentialComponent {
    holder: PublisherHolder<FetchCredentialComponentState>
    handler: FetchCredentialComponentEventHandler
    action: FetchCredentialComponentAction

    constructor(handler: FetchCredentialComponentEventHandler, action: FetchCredentialComponentAction) {
        this.holder = { set: false }
        this.handler = handler
        this.action = action
    }

    hook(pub: Publisher<FetchCredentialComponentState>): void {
        this.holder = { set: true, pub }
    }
    init(stateChanged: Publisher<FetchCredentialComponentState>): void {
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
    fetch(): Promise<void> {
        return this.action.credential.fetch()
    }
}

class ComponentEventHandler implements FetchCredentialComponentEventHandler {
    holder: PublisherHolder<FetchCredentialComponentState>

    constructor() {
        this.holder = { set: false }
    }

    onStateChange(pub: Publisher<FetchCredentialComponentState>): void {
        this.holder = { set: true, pub }
    }

    handleFetchEvent(event: FetchEvent): void {
        this.publish(event)
    }
    handleStoreEvent(_event: StoreEvent): void {
        // FetchComponent ではこのイベントは発生しない
    }

    publish(state: FetchCredentialComponentState): void {
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
