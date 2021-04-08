import { ApiErrorResult, ApiInfraError } from "./data"

export function apiInfraError(err: unknown): ApiErrorResult<ApiInfraError> {
    return { success: false, err: { type: "infra-error", err: `${err}` } }
}
