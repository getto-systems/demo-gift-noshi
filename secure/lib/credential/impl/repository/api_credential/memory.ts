import { ApiCredentialRepository } from "../../../infra"

import { ApiNonce, ApiRoles, LoadResult } from "../../../data"

export function initMemoryAuthCredentialRepository(
    apiNonce: ApiNonce,
    apiRoles: ApiRoles
): ApiCredentialRepository {
    return new MemoryApiCredentialRepository(apiNonce, apiRoles)
}

class MemoryApiCredentialRepository implements ApiCredentialRepository {
    apiNonce: LoadResult<ApiNonce>
    apiRoles: LoadResult<ApiRoles>

    constructor(initialApiNonce: ApiNonce, initialApiRoles: ApiRoles) {
        this.apiNonce = { success: true, content: initialApiNonce }
        this.apiRoles = { success: true, content: initialApiRoles }
    }

    findApiNonce(): LoadResult<ApiNonce> {
        return this.apiNonce
    }
    findApiRoles(): LoadResult<ApiRoles> {
        return this.apiRoles
    }
}
