import { DB, FetchDBResult, DBTransformer } from "./infra"

export function initDB<T>(storage: Storage, key: string, transformer: DBTransformer<T>): DB<T> {
    return new Impl(storage, key, transformer)
}

class Impl<T> implements DB<T> {
    readonly storage: Storage
    readonly key: string

    readonly transformer: DBTransformer<T>

    constructor(storage: Storage, key: string, transformer: DBTransformer<T>) {
        this.storage = storage
        this.key = key
        this.transformer = transformer
    }

    get(): FetchDBResult<T> {
        const value = this.storage.getItem(this.key)
        if (!value) {
            return { found: false }
        }

        const result = this.fromString(value)
        if (!result.success) {
            return { found: false }
        }

        return { found: true, value: result.value }
    }
    set(value: T): void {
        const result = this.toString(value)
        if (!result.success) {
            this.remove()
            return
        }

        this.storage.setItem(this.key, result.value)
    }
    remove(): void {
        this.storage.removeItem(this.key)
    }

    // transform のエラーはこの中で吸収する
    fromString(value: string): TransformResult<T> {
        try {
            return { success: true, value: this.transformer.fromString(value) }
        } catch (err) {
            return { success: false }
        }
    }
    toString(value: T): TransformResult<string> {
        try {
            return { success: true, value: this.transformer.toString(value) }
        } catch (err) {
            return { success: false }
        }
    }
}

type TransformResult<T> = Readonly<{ success: true; value: T }> | Readonly<{ success: false }>
