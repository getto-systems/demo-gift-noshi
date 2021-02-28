import { AuthzMessage } from "./y_protobuf/authz_pb.js"

import { initDB } from "./base"

import { DB } from "./infra"
import {
    decodeBase64StringToUint8Array,
    encodeUint8ArrayToBase64String,
} from "../../z_vendor/protobuf/transform"

type Authz = Readonly<{
    nonce: string
    roles: string[]
}>
export function newDB_Authz(storage: Storage, key: string): DB<Authz> {
    return initDB(storage, key, {
        toString: (value: Authz) => {
            const f = AuthzMessage
            const message = new f()

            message.nonce = value.nonce
            message.roles = value.roles

            const arr = f.encode(message).finish()
            return { success: true, value: encodeUint8ArrayToBase64String(arr) }
        },
        fromString: (raw: string) => {
            return {
                success: true,
                value: AuthzMessage.decode(decodeBase64StringToUint8Array(raw)),
            }
        },
    })
}
