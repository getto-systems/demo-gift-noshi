import { MenuExpand_pb } from "../y_protobuf/outline_pb.js"

import { decodeProtobuf, encodeProtobuf } from "../../../z_vendor/protobuf/helper"
import { IndexedDBTarget, initIndexedDB } from "../indexed_db"

import { DB, FetchDBResult, StoreDBResult } from "../infra"

type Expand = string[][]

type OutsideFeature = Readonly<{
    webDB: IDBFactory
}>
type Params = Readonly<{
    database: string
    key: string
}>
export function newDB_MenuExpand({ webDB }: OutsideFeature, params: Params): DB<Expand> {
    const menuExpand: IndexedDBTarget = {
        store: "menu-expand",
        key: params.key,
    }
    const db = initIndexedDB(webDB, {
        database: params.database,
        stores: [menuExpand.store],
    })
    return {
        get: (): Promise<FetchDBResult<Expand>> => db.get(menuExpand, fromDB),
        set: (value: Expand): Promise<StoreDBResult> => db.set(menuExpand, toDB, value),
        remove: (): Promise<StoreDBResult> => db.remove(menuExpand),
    }
}

function toDB(value: Expand): string {
    return encodeProtobuf(MenuExpand_pb, (message) => {
        message.paths = value.map((labels) => {
            const message = new MenuExpand_pb.Path()
            message.labels = labels
            return message
        })
    })
}
function fromDB(raw: string): Expand {
    return decodeProtobuf(MenuExpand_pb, raw).paths.map((path) => path.labels || [])
}
