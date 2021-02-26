import { BoardValue } from "../../../../z_vendor/getto-application/board/kernel/data"
import { ConvertBoardFieldResult } from "../../../../z_vendor/getto-application/board/validateField/data"

export type Password = string & { Password: never }

// bcrypt を想定しているので、72 バイト以上ではいけない
export const PASSWORD_MAX_BYTES = 72

export type ValidatePasswordError = "empty" | "too-long"

export function convertPassword(
    value: BoardValue,
): ConvertBoardFieldResult<Password, ValidatePasswordError> {
    if (value.length === 0) {
        return { valid: false, err: EMPTY }
    }

    if (new TextEncoder().encode(value).byteLength > PASSWORD_MAX_BYTES) {
        return { valid: false, err: TOO_LONG }
    }

    return { valid: true, value: (value as string) as Password }
}

const EMPTY: ValidatePasswordError[] = ["empty"]
const TOO_LONG: ValidatePasswordError[] = ["too-long"]
