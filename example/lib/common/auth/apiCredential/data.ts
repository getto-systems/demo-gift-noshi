export type ApiCredential = Readonly<{
    nonce: ApiNonce
    roles: ApiRoles
}>

export type ApiNonce = string & { ApiNonce: never }
export function markApiNonce(nonce: string): ApiNonce {
    return nonce as ApiNonce
}

export type ApiRoles = string[] & { ApiRoles: never }
export function markApiRoles(roles: string[]): ApiRoles {
    return roles as ApiRoles
}
export function emptyApiRoles(): ApiRoles {
    return markApiRoles([])
}
