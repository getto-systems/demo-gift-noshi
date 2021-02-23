import { newAuthSignLinkResource } from "../../../../../common/searchParams/x_Action/Link/impl"

import { initMockFormAction } from "./Form/mock"
import { initMockResetPasswordCoreAction } from "./Core/mock"

import { ResetPasswordResource } from "./action"

export function initMockResetPasswordResource(): ResetPasswordResource {
    return {
        reset: {
            core: initMockResetPasswordCoreAction(),
            form: initMockFormAction(),
            terminate: () => null,
        },
        ...newAuthSignLinkResource(),
    }
}