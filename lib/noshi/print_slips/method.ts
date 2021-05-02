import { PrintDeliverySlipsEvent } from "./event"

export interface PrintDeliverySlipsMethod {
    <S>(post: Post<PrintDeliverySlipsEvent, S>): Promise<S>
}

interface Post<E, S> {
    (event: E): S
}
