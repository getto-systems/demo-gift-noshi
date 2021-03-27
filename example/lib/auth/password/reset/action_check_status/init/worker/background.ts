import { checkSessionStatusEventHasDone } from "../../../check_status/impl/core"

import { WorkerHandler } from "../../../../../../z_vendor/getto-application/action/worker/background"

import {
    CheckPasswordResetSendingStatusProxyMessage,
    CheckPasswordResetSendingStatusProxyResponse,
} from "./message"
import { newCheckSendingStatusMaterialPod } from "../common"
import { backgroundLocationDetecter } from "../../../../../../z_vendor/getto-application/location/helper"

type OutsideFeature = Readonly<{
    webCrypto: Crypto
}>
export function newCheckPasswordResetSendingStatusWorkerHandler(
    feature: OutsideFeature,
    post: Post<CheckPasswordResetSendingStatusProxyResponse>,
): WorkerHandler<CheckPasswordResetSendingStatusProxyMessage> {
    const { webCrypto } = feature
    const pod = newCheckSendingStatusMaterialPod(webCrypto)
    return (message) => {
        switch (message.method) {
            case "checkStatus":
                pod.initCheckStatus(backgroundLocationDetecter(message.params))((event) => {
                    post({
                        ...message,
                        done: checkSessionStatusEventHasDone(event),
                        event,
                    })
                })
                return
        }
    }
}

interface Post<R> {
    (response: R): void
}
