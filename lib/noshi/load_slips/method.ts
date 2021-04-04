import { LocationTypes } from "../../z_vendor/getto-application/location/infra"

import { LoadCurrentDeliverySlipEvent, LoadDeliverySlipsEvent } from "./event"

import { DeliverySlipNumber } from "../slip/data"

export interface LoadDeliverySlipsPod {
    (detecter: LoadDeliverySlipsLocationDetecter): LoadDeliverySlipsMethod
}
export interface LoadDeliverySlipsMethod {
    (post: Post<LoadDeliverySlipsEvent>): void
}

export interface LoadCurrentDeliverySlipPod {
    (detecter: LoadDeliverySlipsLocationDetecter): LoadCurrentDeliverySlipMethod
}
export interface LoadCurrentDeliverySlipMethod {
    (post: Post<LoadCurrentDeliverySlipEvent>): void
}

type LoadDeliverySlipsLocationTypes = LocationTypes<DeliverySlipNumber>
export type LoadDeliverySlipsLocationDetecter = LoadDeliverySlipsLocationTypes["detecter"]
export type LoadDeliverySlipsLocationDetectMethod = LoadDeliverySlipsLocationTypes["method"]
export type LoadDeliverySlipsLocationInfo = LoadDeliverySlipsLocationTypes["info"]

interface Post<T> {
    (event: T): void
}
