import { newAuthzRepository } from "../../auth/auth_ticket/kernel/infra/repository/authz"
import { newNotifyUnexpectedErrorRemote } from "../notify_unexpected_error/infra/remote/notify"

import { initNotifyUnexpectedErrorCoreAction } from "./core/impl"

import { NotifyUnexpectedErrorResource } from "./resource"
import { initNotifyUnexpectedErrorResource } from "./impl"

type OutsideFeature = Readonly<{
    webStorage: Storage
    webCrypto: Crypto
}>
export function newNotifyUnexpectedErrorResource(
    feature: OutsideFeature,
): NotifyUnexpectedErrorResource {
    const { webStorage, webCrypto } = feature
    return initNotifyUnexpectedErrorResource(
        initNotifyUnexpectedErrorCoreAction({
            authz: newAuthzRepository(webStorage),
            notify: newNotifyUnexpectedErrorRemote(webCrypto),
        }),
    )
}