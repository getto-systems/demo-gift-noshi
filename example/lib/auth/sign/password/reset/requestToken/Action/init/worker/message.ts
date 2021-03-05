import { WorkerProxySpec } from "../../../../../../../../z_vendor/getto-application/action/worker/message"

import { RequestResetTokenEvent } from "../../../event"

import { ConvertBoardResult } from "../../../../../../../../z_vendor/getto-application/board/kernel/data"
import { RequestResetTokenFields } from "../../../data"

export type RequestPasswordResetTokenProxyMaterial = Readonly<{
    requestToken: RequestToken["method"]
}>
export type RequestPasswordResetTokenProxyMessage = RequestToken["message"]
export type RequestPasswordResetTokenProxyResponse = RequestToken["response"]

type RequestToken = WorkerProxySpec<
    "requestToken",
    Readonly<{ fields: ConvertBoardResult<RequestResetTokenFields> }>,
    RequestResetTokenEvent
>
