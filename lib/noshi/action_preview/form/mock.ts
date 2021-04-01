import { PreviewFormAction } from "./action"

export function mockAuthenticatePasswordFormAction(): PreviewFormAction {
    return {
        terminate: () => null,
    }
}
