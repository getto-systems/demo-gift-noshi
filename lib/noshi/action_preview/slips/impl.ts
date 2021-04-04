import { ApplicationAbstractStateAction } from "../../../z_vendor/getto-application/action/impl"

import { loadDeliverySlips } from "../../load_slips/impl/core"

import { LoadDeliverySlipsInfra } from "../../load_slips/infra"

import {
    PreviewSlipsMaterial,
    PreviewSlipsAction,
    PreviewSlipsState,
    initialPreviewSlipsState,
} from "./action"

import { LoadDeliverySlipsLocationDetecter } from "../../load_slips/method"

export type PreviewSlipsInfra = LoadDeliverySlipsInfra

export function initPreviewSlipsMaterial(
    infra: PreviewSlipsInfra,
    detecter: LoadDeliverySlipsLocationDetecter,
): PreviewSlipsMaterial {
    return {
        load: loadDeliverySlips(infra)(detecter),
    }
}

export function initPreviewSlipsAction(material: PreviewSlipsMaterial): PreviewSlipsAction {
    return new Action(material)
}

class Action
    extends ApplicationAbstractStateAction<PreviewSlipsState>
    implements PreviewSlipsAction {
    readonly initialState = initialPreviewSlipsState

    material: PreviewSlipsMaterial

    constructor(material: PreviewSlipsMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.load(this.post)
        })
    }
}
