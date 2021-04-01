import { LoadDeliverySlipsEvent } from "./event"

import { DeliverySlipNumber } from "./data"
import { LocationTypes } from "../../z_vendor/getto-application/location/infra"

export interface LoadDeliverySlipsPod {
    (detecter: LoadDeliverySlipsLocationDetecter): LoadDeliverySlipsMethod
}
export interface LoadDeliverySlipsMethod {
    (post: Post<LoadDeliverySlipsEvent>): void
}

type LoadDeliverySlipsLocationTypes = LocationTypes<DeliverySlipNumber>
export type LoadDeliverySlipsLocationDetecter = LoadDeliverySlipsLocationTypes["detecter"]
export type LoadDeliverySlipsLocationDetectMethod = LoadDeliverySlipsLocationTypes["method"]
export type LoadDeliverySlipsLocationInfo = LoadDeliverySlipsLocationTypes["info"]

interface Post<T> {
    (event: T): void
}
