import { LocationTypes } from "../../z_vendor/getto-application/location/infra"

import { LoadCurrentDeliverySlipEvent, LoadDeliverySlipsEvent } from "./event"

import { DeliverySlipNumber } from "../slip/data"

export interface LoadDeliverySlipsPod {
    (detecter: LoadDeliverySlipsLocationDetecter): LoadDeliverySlipsMethod
}
export interface LoadDeliverySlipsMethod {
    <S>(post: Post<LoadDeliverySlipsEvent, S>): Promise<S>
}

export interface LoadCurrentDeliverySlipPod {
    (detecter: LoadDeliverySlipsLocationDetecter): LoadCurrentDeliverySlipMethod
}
export interface LoadCurrentDeliverySlipMethod {
    <S>(post: Post<LoadCurrentDeliverySlipEvent, S>): Promise<S>
}

type LoadDeliverySlipsLocationTypes = LocationTypes<DeliverySlipNumber>
export type LoadDeliverySlipsLocationDetecter = LoadDeliverySlipsLocationTypes["detecter"]
export type LoadDeliverySlipsLocationDetectMethod = LoadDeliverySlipsLocationTypes["method"]
export type LoadDeliverySlipsLocationInfo = LoadDeliverySlipsLocationTypes["info"]

interface Post<E, S> {
    (event: E): S
}
