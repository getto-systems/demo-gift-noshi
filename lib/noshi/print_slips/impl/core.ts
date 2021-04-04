import { PrintDeliverySlipsInfra } from "../infra"

import { PrintDeliverySlipsMethod } from "../method"

import { PrintDeliverySlipsEvent } from "../event"

interface PrintSlips {
    (infra: PrintDeliverySlipsInfra): PrintDeliverySlipsMethod
}
export const printDeliverySlips: PrintSlips = (infra) => async (post) => {
    const { slips, sheet } = infra

    post({ type: "try-to-print" })

    const result = await sheet(slips)
    if (!result.success) {
        post({ type: "failed-to-print", err: result.err })
        return
    }
    post({ type: "succeed-to-print", href: result.href })
}

export function printDeliverySlipsEventHasDone(event: PrintDeliverySlipsEvent): boolean {
    switch (event.type) {
        case "try-to-print":
            return false

        case "succeed-to-print":
        case "failed-to-print":
            return true
    }
}
