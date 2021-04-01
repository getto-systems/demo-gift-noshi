import { ApplicationStateAction } from "../../../z_vendor/getto-application/action/action"

export type PreviewCoreAction = ApplicationStateAction<PreviewCoreState>

export type PreviewCoreMaterial = Readonly<{
    // TODO load: LoadPreviewMethod
}>

export type PreviewCoreState = Readonly<{ type: "initial-preview" }> // TODO | LoadPreviewEvent

export const initialPreviewCoreState: PreviewCoreState = { type: "initial-preview" }
