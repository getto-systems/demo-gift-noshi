import { initSimulateRemoteAccess } from "../../../../../../../z_getto/remote/simulate"

import { WaitTime } from "../../../../../../../z_getto/infra/config/infra"
import { LoadOutlineMenuBadgeRemoteAccess, LoadOutlineMenuBadgeSimulator } from "../../../infra"

export function initLoadOutlineMenuBadgeSimulateRemoteAccess(
    simulator: LoadOutlineMenuBadgeSimulator,
    time: WaitTime
): LoadOutlineMenuBadgeRemoteAccess {
    return initSimulateRemoteAccess(simulator, time)
}
