import { StorageError } from "../../../../common/auth/storage/data"

export type StartEvent = ForceStartEvent | Readonly<{ type: "storage-error"; err: StorageError }>
export type ForceStartEvent = Readonly<{ type: "succeed-to-start-continuous-renew" }>