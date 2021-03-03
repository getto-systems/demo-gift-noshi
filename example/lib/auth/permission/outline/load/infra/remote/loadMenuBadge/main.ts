import { env } from "../../../../../../../y_environment/env"

import { initApiLoadOutlineMenuBadge } from "../../../../../../../z_external/api/auth/permission/loadMenuBadge"
import { wrapRemote } from "../../../../../../../z_vendor/getto-application/infra/remote/helper"

import { LoadOutlineMenuBadgeRemotePod } from "../../../infra"

export function newLoadOutlineMenuBadgeRemote(): LoadOutlineMenuBadgeRemotePod {
    return wrapRemote(initApiLoadOutlineMenuBadge(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}