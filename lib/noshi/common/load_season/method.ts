import { LoadSeasonEvent } from "./event"

export interface LoadSeasonMethod {
    (post: Post<LoadSeasonEvent>): void
}

interface Post<E> {
    (event: E): void
}
