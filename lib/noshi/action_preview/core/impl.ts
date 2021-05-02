import { ApplicationAbstractStateAction } from "../../../z_vendor/getto-application/action/impl"

import { loadCurrentDeliverySlip } from "../../load_slips/impl/core"
import { printDeliverySlips } from "../../print_slips/impl/core"

import { LoadDeliverySlipsInfra } from "../../load_slips/infra"
import { PrintDeliverySlipsInfra } from "../../print_slips/infra"

import {
    PreviewCoreMaterial,
    PreviewCoreAction,
    PreviewCoreState,
    initialPreviewCoreState,
} from "./action"

import { LoadDeliverySlipsLocationDetecter } from "../../load_slips/method"

export type PreviewCoreInfra = LoadDeliverySlipsInfra & PrintDeliverySlipsInfra

export function initPreviewCoreMaterial(
    infra: PreviewCoreInfra,
    detecter: LoadDeliverySlipsLocationDetecter,
): PreviewCoreMaterial {
    return {
        load: loadCurrentDeliverySlip(infra)(detecter),
        print: printDeliverySlips(infra),
    }
}

export function initPreviewCoreAction(material: PreviewCoreMaterial): PreviewCoreAction {
    return new Action(material)
}

class Action extends ApplicationAbstractStateAction<PreviewCoreState> implements PreviewCoreAction {
    readonly initialState = initialPreviewCoreState

    material: PreviewCoreMaterial

    constructor(material: PreviewCoreMaterial) {
        super(() => this.material.load(this.post))
        this.material = material
    }

    print(): Promise<PreviewCoreState> {
        return this.material.print(this.post)
    }
}
