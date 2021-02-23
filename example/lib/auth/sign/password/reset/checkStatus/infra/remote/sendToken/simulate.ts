import { initSimulateRemoteAccess } from "../../../../../../../../z_getto/remote/simulate"

import { WaitTime } from "../../../../../../../../z_getto/infra/config/infra"
import { SendTokenRemote, SendTokenSimulator } from "../../../infra"

export function initSendTokenSimulate(
    simulator: SendTokenSimulator,
    time: WaitTime,
): SendTokenRemote {
    return initSimulateRemoteAccess(simulator, time)
}