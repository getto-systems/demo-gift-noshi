import { mockLocationDetecter } from "../../../z_vendor/getto-application/location/mock"

import { detectDocsContentPath } from "./core"

import { LoadDocsContentPathLocationDetecter } from "../method"

export function initLoadDocsContentPathLocationDetecter(
    currentURL: URL,
    version: string,
): LoadDocsContentPathLocationDetecter {
    return mockLocationDetecter(currentURL, detectDocsContentPath({ version }))
}
