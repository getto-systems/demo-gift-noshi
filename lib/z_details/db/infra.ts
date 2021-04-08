export interface DB<T> {
    get(): FetchDBResult<T>
    set(value: T): void
    remove(): void
}

export type FetchDBResult<T> =
    | Readonly<{ found: true; value: T }>
    | Readonly<{ found: false }>

export interface DBTransformer<T> {
    toString(value: T): string
    fromString(raw: string): T
}
