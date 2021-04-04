import { PrintDeliverySlipsError } from "./data"

export type PrintDeliverySlipsEvent =
    | Readonly<{ type: "succeed-to-print"; href: string }>
    | Readonly<{ type: "failed-to-print"; err: PrintDeliverySlipsError }>
