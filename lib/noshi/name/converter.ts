import { BoardValue } from "../../z_vendor/getto-application/board/kernel/data"
import { NoshiName } from "./data"

export function noshiNameBoardConverter(name: BoardValue): NoshiName {
    return (name as string) as NoshiName
}
