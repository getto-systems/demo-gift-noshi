import { deliverySlipNumberLocationConverter } from "./converter"

import { LoadDeliverySlipsInfra } from "../infra"

import {
    LoadCurrentDeliverySlipPod,
    LoadDeliverySlipsLocationDetectMethod,
    LoadDeliverySlipsPod,
} from "../method"

import { LoadCurrentDeliverySlipEvent, LoadDeliverySlipsEvent } from "../event"

import { DeliverySlip, DeliverySlipPrintState } from "../data"

interface Detecter {
    (): LoadDeliverySlipsLocationDetectMethod
}
export const detectDeliverySlipNumber: Detecter = () => (currentURL) =>
    deliverySlipNumberLocationConverter(currentURL)

interface LoadSlips {
    (infra: LoadDeliverySlipsInfra): LoadDeliverySlipsPod
}
export const loadDeliverySlips: LoadSlips = (infra) => (detecter) => async (post) => {
    const { slips } = infra

    const result = detecter()
    if (!result.valid) {
        post({
            type: "succeed-to-load",
            slips: slips.map(
                (data, index): DeliverySlip => ({
                    data,
                    printState: index === 0 ? "working" : "waiting",
                }),
            ),
        })
        return
    }

    const number = result.value

    post({
        type: "succeed-to-load",
        slips: slips.reduce(
            (acc, data) => {
                acc.slips.push({ data, printState: printState() })
                acc.hasMatched = acc.hasMatched || isMatched()
                return acc

                function isMatched(): boolean {
                    return number === data.number
                }
                function printState(): DeliverySlipPrintState {
                    if (isMatched()) {
                        return "working"
                    }
                    if (!acc.hasMatched) {
                        return "done"
                    }
                    return "waiting"
                }
            },
            { slips: <DeliverySlip[]>[], hasMatched: false },
        ).slips,
    })
}

export function loadDeliverySlipsEventHasDone(_event: LoadDeliverySlipsEvent): boolean {
    return true
}

interface LoadCurrentSlip {
    (infra: LoadDeliverySlipsInfra): LoadCurrentDeliverySlipPod
}
export const loadCurrentDeliverySlip: LoadCurrentSlip = (infra) => (detecter) => async (post) => {
    const { slips } = infra

    if (slips.length === 0) {
        post({ type: "failed-to-load", err: { type: "empty" } })
        return
    }

    const result = detecter()
    if (!result.valid) {
        post({ type: "succeed-to-load", slip: slips[0] })
        return
    }

    const slip = slips.find((data) => data.number === result.value)
    if (!slip) {
        post({ type: "failed-to-load", err: { type: "not-found" } })
        return
    }

    post({ type: "succeed-to-load", slip })
}

export function loadCurrentDeliverySlipEventHasDone(_event: LoadCurrentDeliverySlipEvent): boolean {
    return true
}
