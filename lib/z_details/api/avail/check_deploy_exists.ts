import { ApiResult } from "../data"

interface Check {
    (url: string): Promise<CheckResult>
}

type CheckResult = ApiResult<CheckResponse, CheckError>
type CheckResponse = Readonly<{ found: boolean }>
type CheckError = Readonly<{ type: "server-error" }>

export function newApi_CheckDeployExists(): Check {
    return async (url): Promise<CheckResult> => {
        const response = await fetch(url, { method: "HEAD" })
        if (!response.ok) {
            if (response.status >= 500) {
                return { success: false, err: { type: "server-error" } }
            }
            return { success: true, value: { found: false } }
        }
        return { success: true, value: { found: true } }
    }
}
