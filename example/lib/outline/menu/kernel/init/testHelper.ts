import { initLocationDetecter } from "../../../../z_vendor/getto-application/location/test_helper"

import { detectMenuTargetPath } from "../impl/core"

import { LoadMenuLocationDetecter } from "../method"

export function initLoadMenuLocationDetecter(
    currentURL: URL,
    version: string,
): LoadMenuLocationDetecter {
    return initLocationDetecter(currentURL, detectMenuTargetPath({ version }))
}
