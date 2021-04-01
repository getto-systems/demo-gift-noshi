import { ApplicationAction } from "../../z_vendor/getto-application/action/action"

import { PreviewCoreAction, PreviewCoreState } from "./core/action"
import { PreviewFormAction } from "./form/action"
import { PreviewSlipsAction, PreviewSlipsState } from "./slips/action"

export type PreviewResource = Readonly<{
    preview: PreviewAction
}>
export interface PreviewAction extends ApplicationAction {
    readonly core: PreviewCoreAction
    readonly form: PreviewFormAction
    readonly slips: PreviewSlipsAction
}

export type PreviewResourceState = Readonly<{
    state: PreviewCoreState
}>

export type PreviewSlipsResource = Readonly<{
    slips: PreviewSlipsAction
}>
export type PreviewSlipsResourceState = Readonly<{
    state: PreviewSlipsState
}>
