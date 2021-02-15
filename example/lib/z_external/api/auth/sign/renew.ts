import { parseAuthCredential, parseError } from "./common"

import { RawAuthCredential } from "./data"
import { ApiResult } from "../../data"

export interface ApiAuthSignRenew {
    (nonce: SendTicketNonce): Promise<RawRenewResult>
}

type SendTicketNonce = string
type RawRenewResult = ApiResult<RawAuthCredential>

export function initApiAuthSignRenew(apiServerURL: string): ApiAuthSignRenew {
    return async (nonce: SendTicketNonce): Promise<RawRenewResult> => {
        const response = await fetch(apiServerURL, {
            method: "POST",
            credentials: "include",
            headers: [
                ["X-GETTO-EXAMPLE-ID-HANDLER", "Renew"],
                ["X-GETTO-EXAMPLE-ID-TICKET-NONCE", nonce],
            ],
        })

        if (response.ok) {
            return parseAuthCredential(response)
        } else {
            return { success: false, err: await parseError(response) }
        }
    }
}