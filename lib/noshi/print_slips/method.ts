import { PrintDeliverySlipsEvent } from "./event"

export interface PrintDeliverySlipsMethod {
    (post: Post<PrintDeliverySlipsEvent>): void
}

interface Post<T> {
    (event: T): void
}
