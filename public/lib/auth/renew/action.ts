import { CredentialAction, CredentialEventHandler } from "../../credential/action"

import { AuthCredential, TicketNonce, RenewError } from "../../credential/data"

export interface RenewComponentAction {
    credential: CredentialAction,
}

export interface RenewComponent {
    init(stateChanged: Publisher<RenewComponentState>): void
    terminate(): void
    trigger(operation: RenewComponentOperation): Promise<void>
}

export type RenewComponentState =
    Readonly<{ type: "initial-renew" }> |
    Readonly<{ type: "try-to-renew" }> |
    Readonly<{ type: "delayed-to-renew" }> |
    Readonly<{ type: "require-login" }> |
    Readonly<{ type: "failed-to-renew", err: RenewError }> |
    Readonly<{ type: "succeed-to-renew", authCredential: AuthCredential }>

export const initialRenewComponentState: RenewComponentState = { type: "initial-renew" }

export type RenewComponentOperation =
    Readonly<{ type: "renew", ticketNonce: TicketNonce }>

export interface RenewComponentEventHandler extends CredentialEventHandler {
    onStateChange(stateChanged: Publisher<RenewComponentState>): void
}

interface Publisher<T> {
    (state: T): void
}
