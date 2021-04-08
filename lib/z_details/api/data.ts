export type ApiResult<V, E> = Readonly<{ success: true; value: V }> | ApiErrorResult<E>
export type ApiErrorResult<E> = Readonly<{ success: false; err: E }>

export type ApiCommonError = ApiServerError | ApiInfraError

export type ApiServerError = Readonly<{ type: "server-error" }>
export type ApiInfraError = Readonly<{ type: "infra-error"; err: string }>
