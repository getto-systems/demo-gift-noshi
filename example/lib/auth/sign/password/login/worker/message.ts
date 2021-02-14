import {
    WorkerProxyMethodMessage,
    WorkerProxyMethodResponse,
} from "../../../../../common/getto-worker/worker/message"

import { SubmitEvent } from "../event"

import { FormConvertResult } from "../../../../../common/getto-form/form/data"
import { LoginFields } from "../data"

export type LoginActionProxyMessage = WorkerProxyMethodMessage<"submit", SubmitProxyParams>
export type LoginActionProxyResponse = WorkerProxyMethodResponse<"submit", SubmitEvent>

export type SubmitProxyParams = Readonly<{ fields: FormConvertResult<LoginFields> }>