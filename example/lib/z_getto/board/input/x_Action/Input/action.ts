import { ApplicationAction } from "../../../../application/action"

import { ClearBoardValueMethod, SetBoardValueMethod } from "../../method"

import { InputBoardValueEvent } from "../../event"

import { BoardValue, emptyBoardValue } from "../../../kernel/data"
import { InputBoardValueType } from "../../data"

export type InputBoardValueResource = Readonly<{
    type: InputBoardValueType
    input: InputBoardValueAction
}>

export interface InputBoardValueAction extends ApplicationAction<InputBoardValueState> {
    addInputHandler(handler: InputBoardValueHandler): void

    get(): BoardValue
    set(value: BoardValue): void
    clear(): void
}
export interface InputBoardValueHandler {
    (): void
}

export type InputBoardValueMaterial = Readonly<{
    set: SetBoardValueMethod
    clear: ClearBoardValueMethod
}>

export type InputBoardValueState = InputBoardValueEvent

export const initialInputBoardState: InputBoardValueState = emptyBoardValue