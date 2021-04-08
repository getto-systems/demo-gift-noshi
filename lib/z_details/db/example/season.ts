import { Season_pb } from "../y_protobuf/example_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../z_vendor/protobuf/helper"
import { initDB } from "../impl"

import { DB } from "../infra"

type Season = Readonly<{
    year: number
    period: string
}>
export function newDB_Season(storage: Storage, key: string): DB<Season> {
    return initDB(storage, key, {
        toString: (value: Season) =>
            encodeProtobuf(Season_pb, (message) => {
                message.year = value.year
            }),
        fromString: (raw: string) => decodeProtobuf(Season_pb, raw),
    })
}
