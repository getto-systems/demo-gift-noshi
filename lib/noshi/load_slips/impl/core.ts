import { deliverySlipHrefConverter, deliverySlipNumberLocationConverter } from "./converter"

import { LoadDeliverySlipsInfra } from "../infra"

import {
    LoadCurrentDeliverySlipPod,
    LoadDeliverySlipsLocationDetectMethod,
    LoadDeliverySlipsPod,
} from "../method"

import { LoadCurrentDeliverySlipEvent, LoadDeliverySlipsEvent } from "../event"

import { DeliverySlip, DeliverySlipData, DeliverySlipPrintState } from "../../slip/data"
import { NextDeliverySlipHref } from "../data"

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
        return post({
            type: "succeed-to-load",
            slips: slips.map(
                (data, index): DeliverySlip => ({
                    data,
                    printState: index === 0 ? "working" : "waiting",
                    href: deliverySlipHrefConverter(data),
                }),
            ),
        })
    }

    const number = result.value

    return post({
        type: "succeed-to-load",
        slips: slips.reduce(
            (acc, data) => {
                acc.slips.push({
                    data,
                    printState: printState(),
                    href: deliverySlipHrefConverter(data),
                })
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
        return post({ type: "failed-to-load", err: { type: "empty" } })
    }

    const result = detecter()
    if (!result.valid) {
        const slip = slips[0]
        return post({ type: "succeed-to-load", slip, next: nextSlip(slip) })
    }

    const slip = slips.find((data) => data.number === result.value)
    if (!slip) {
        return post({ type: "failed-to-load", err: { type: "not-found" } })
    }

    return post({ type: "succeed-to-load", slip, next: nextSlip(slip) })

    function nextSlip(current: DeliverySlipData): NextDeliverySlipHref {
        type MatchResult =
            | Readonly<{ isMatched: false }>
            | Readonly<{ isMatched: true; next: NextResult }>
        type NextResult =
            | Readonly<{ isProcessed: false }>
            | Readonly<{ isProcessed: true; href: string }>
        return nextHref(
            slips.reduce(
                (acc, slip): MatchResult => {
                    if (acc.isMatched) {
                        if (acc.next.isProcessed) {
                            return acc
                        }
                        return {
                            isMatched: true,
                            next: { isProcessed: true, href: deliverySlipHrefConverter(slip) },
                        }
                    }
                    return {
                        isMatched: slip.number === current.number,
                        next: { isProcessed: false },
                    }
                },
                <MatchResult>{ isMatched: false },
            ),
        )

        function nextHref(result: MatchResult): NextDeliverySlipHref {
            if (!result.isMatched) {
                // current は必ず slips に含まれているのでマッチしないことはないので
                // 実際にはここには来ない
                throw new Error("not matched")
            }
            if (!result.next.isProcessed) {
                return { hasNext: false }
            }
            return { hasNext: true, href: result.next.href }
        }
    }
}

export function loadCurrentDeliverySlipEventHasDone(_event: LoadCurrentDeliverySlipEvent): boolean {
    return true
}
