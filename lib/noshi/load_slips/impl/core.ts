import { deliverySlipNumberLocationConverter } from "./converter"

import { LoadDeliverySlipsInfra } from "../infra"

import { LoadDeliverySlipsLocationDetectMethod, LoadDeliverySlipsPod } from "../method"

import { DeliverySlip, DeliverySlipPrintState } from "../data"
import { LoadDeliverySlipsEvent } from "../event"

interface Detecter {
    (): LoadDeliverySlipsLocationDetectMethod
}
export const detectDeliverySlipNumber: Detecter = () => (currentURL) =>
    deliverySlipNumberLocationConverter(currentURL)

interface Load {
    (infra: LoadDeliverySlipsInfra): LoadDeliverySlipsPod
}
export const loadDeliverySlips: Load = (infra) => (detecter) => async (post) => {
    const { slips } = infra

    const result = detecter()
    if (!result.valid) {
        post({
            type: "succeed-to-load",
            slips: slips.map((data): DeliverySlip => ({ data, printState: "waiting" })),
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
