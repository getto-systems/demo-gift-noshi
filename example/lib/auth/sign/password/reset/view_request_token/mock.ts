import { initSignLinkResource } from "../../../common/link/action/impl"

import { mockRequestResetTokenCoreAction } from "./core/mock"
import { mockRequestResetTokenFormAction } from "./form/mock"

import { RequestResetTokenEntryPoint, RequestResetTokenResource } from "./entry_point"

export function mockRequestResetTokenEntryPoint(): RequestResetTokenEntryPoint {
    return {
        resource: mockRequestResetTokenResource(),
        terminate: () => null,
    }
}
export function mockRequestResetTokenResource(): RequestResetTokenResource {
    return {
        requestToken: {
            core: mockRequestResetTokenCoreAction(),
            form: mockRequestResetTokenFormAction(),
            terminate: () => null,
        },
        ...initSignLinkResource(),
    }
}
