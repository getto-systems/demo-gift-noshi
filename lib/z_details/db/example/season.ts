import { Season_pb } from "../y_protobuf/example_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../z_vendor/protobuf/helper"
import { IndexedDBTarget, initIndexedDB } from "../indexed_db"

import { DB, FetchDBResult, StoreDBResult } from "../infra"

type Season = Readonly<{
    year: number
    period: string
}>

type OutsideFeature = Readonly<{
    webDB: IDBFactory
}>
type Params = Readonly<{
    database: string
}>
export function newDB_Season({ webDB }: OutsideFeature, params: Params): DB<Season> {
    const currentSeason: IndexedDBTarget = {
        store: "season",
        key: "current",
    }
    const db = initIndexedDB(webDB, {
        database: params.database,
        stores: [currentSeason.store],
    })
    return {
        get: (): Promise<FetchDBResult<Season>> => db.get(currentSeason, fromDB),
        set: (value: Season): Promise<StoreDBResult> => db.set(currentSeason, toDB, value),
        remove: (): Promise<StoreDBResult> => db.remove(currentSeason),
    }
}

function toDB(value: Season): string {
    return encodeProtobuf(Season_pb, (message) => {
        message.year = value.year
    })
}
function fromDB(raw: string): Season {
    return decodeProtobuf(Season_pb, raw)
}
