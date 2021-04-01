import { ApplicationAbstractStateAction } from "../../../z_vendor/getto-application/action/impl"

import { loadCurrentDeliverySlip } from "../../load_slips/impl/core"

import { LoadDeliverySlipsInfra } from "../../load_slips/infra"

import {
    PreviewCoreMaterial,
    PreviewCoreAction,
    PreviewCoreState,
    initialPreviewCoreState,
} from "./action"

import { LoadDeliverySlipsLocationDetecter } from "../../load_slips/method"

export type PreviewCoreInfra = LoadDeliverySlipsInfra

export function initPreviewCoreMaterial(
    infra: PreviewCoreInfra,
    detecter: LoadDeliverySlipsLocationDetecter,
): PreviewCoreMaterial {
    return {
        load: loadCurrentDeliverySlip(infra)(detecter),
    }
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
            this.material.load(this.post)
        })
    }
}
