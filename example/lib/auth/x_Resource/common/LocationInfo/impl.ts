import { detectPagePathname } from "../../../sign/location/impl"
import { detectResetToken } from "../../../sign/password/reset/register/impl"

import { LoginLocationInfo } from "./locationInfo"

export function initLoginLocationInfo(currentURL: URL): LoginLocationInfo {
    return {
        getPagePathname: () => detectPagePathname(currentURL),
        getResetToken: () => detectResetToken(currentURL),
    }
}