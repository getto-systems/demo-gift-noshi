import { BoardValue } from "./data"

export function readBoardValue(input: HTMLInputElement): BoardValue {
    return markBoardValue(input.value)
}
export function toBoardValue(input: string): BoardValue {
    return markBoardValue(input)
}

function markBoardValue(input: string): BoardValue {
    return input as BoardValue
}
