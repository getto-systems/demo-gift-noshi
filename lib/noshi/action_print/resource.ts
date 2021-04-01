import { BaseTypes } from "../action_base/resource"
import { PreviewResource } from "../action_preview/resource"

type PrintTypes = BaseTypes<PreviewResource>
export type PrintView = PrintTypes["view"]
export type PrintResource = PrintTypes["resource"]
