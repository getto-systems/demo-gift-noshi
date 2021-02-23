import { ApplicationStateHandler } from "./data"

export type ApplicationEntryPoint<R> = Readonly<{
    resource: R
    terminate: { (): void }
}>

export interface ApplicationAction {
    terminate(): void
}

export interface ApplicationStateAction<S> extends ApplicationAction {
    ignition(): ApplicationStateIgnition<S>
}

export interface ApplicationStateIgnition<S> extends ApplicationStateSubscriber<S> {
    ignite(): void
}
export interface ApplicationStateSubscriber<S> {
    addStateHandler(handler: ApplicationStateHandler<S>): void
    removeStateHandler(target: ApplicationStateHandler<S>): void
}
