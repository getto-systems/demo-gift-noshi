import { BoardValue } from "../../../../../z_vendor/getto-application/board/kernel/data"
import { ConvertBoardFieldResult } from "../../../../../z_vendor/getto-application/board/validateField/data"
import { Password, ValidatePasswordError } from "./data"

// bcrypt を想定しているので、72 バイト以上ではいけない
export const PASSWORD_MAX_BYTES = 72

export function convertPasswordFromBoard(
    value: BoardValue,
): ConvertBoardFieldResult<Password, ValidatePasswordError> {
    if (value.length === 0) {
        return { valid: false, err: EMPTY }
    }

    const byteLength = new TextEncoder().encode(value).byteLength
    if (byteLength > PASSWORD_MAX_BYTES) {
        return { valid: false, err: TOO_LONG(byteLength > value.length) }
    }

    return { valid: true, value: markPassword(value) }
}

const EMPTY: ValidatePasswordError[] = [{ type: "empty" }]
function TOO_LONG(multiByte: boolean): ValidatePasswordError[] {
    return [{ type: "too-long", maxBytes: PASSWORD_MAX_BYTES, multiByte }]
}

function markPassword(password: string): Password {
    return password as Password
}
