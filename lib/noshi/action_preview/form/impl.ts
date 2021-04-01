import { initInputNoshiNameAction } from "../../name/action_input/core/impl"

import { PreviewFormAction } from "./action"

import { NoshiName } from "../../name/data"

export function initPreviewFormAction(provider: Provider<NoshiName>): PreviewFormAction {
    const noshiName = initInputNoshiNameAction(provider)
    return {
        noshiName,
        reset: () => {
            noshiName.reset()
        },
        terminate: () => {
            noshiName.terminate()
        },
    }
}

interface Provider<T> {
    (): T
}
