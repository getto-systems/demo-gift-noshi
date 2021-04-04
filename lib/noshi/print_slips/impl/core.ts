import { PrintDeliverySlipsInfra } from "../infra"

import { PrintDeliverySlipsMethod } from "../method"

import { PrintDeliverySlipsEvent } from "../event"

interface PrintSlips {
    (infra: PrintDeliverySlipsInfra): PrintDeliverySlipsMethod
}
export const printDeliverySlips: PrintSlips = (infra) => async (post) => {
    const { slips, sheet } = infra

    const href = await sheet(slips)
    post({ type: "succeed-to-print", href })
}

export function printDeliverySlipsEventHasDone(_event: PrintDeliverySlipsEvent): boolean {
    return true
}
