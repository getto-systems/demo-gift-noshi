import { ApplicationAbstractStateAction } from "../../../z_vendor/getto-application/action/impl"

import {
    PreviewCoreMaterial,
    PreviewCoreAction,
    PreviewCoreState,
    initialPreviewCoreState,
} from "./action"

export type LoadMenuCoreInfra = {
    // TODO preview infra
}

export function initPreviewCoreMaterial(): PreviewCoreMaterial {
    return {}
}

export function initPreviewCoreAction(material: PreviewCoreMaterial): PreviewCoreAction {
    return new Action(material)
}

class Action extends ApplicationAbstractStateAction<PreviewCoreState> implements PreviewCoreAction {
    readonly initialState = initialPreviewCoreState

    material: PreviewCoreMaterial

    constructor(material: PreviewCoreMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            // TODO load preview
        })
    }
}
