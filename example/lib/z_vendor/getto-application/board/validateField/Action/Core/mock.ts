import { ApplicationAbstractStateAction } from "../../../../action/impl"

import { ValidateBoardFieldAction, ValidateBoardFieldState } from "./action"

import { ConvertBoardFieldResult } from "../../data"

export function initMockValidateBoardFieldAction<N extends string, T, E>(
    name: N,
    value: ConvertBoardFieldResult<T, E>,
): ValidateBoardFieldAction<T, E> {
    return new Mock(name, value)
}

class Mock<T, E>
    extends ApplicationAbstractStateAction<ValidateBoardFieldState<E>>
    implements ValidateBoardFieldAction<T, E> {
    readonly initialState: ValidateBoardFieldState<E> = { valid: true }

    readonly name: string
    value: ConvertBoardFieldResult<T, E>

    constructor(name: string, value: ConvertBoardFieldResult<T, E>) {
        super()
        this.name = name
        this.value = value
    }

    get(): ConvertBoardFieldResult<T, E> {
        return this.value
    }
    check(): void {
        // mock では特に何もしない
    }
}
