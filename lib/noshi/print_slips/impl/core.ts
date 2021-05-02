import { PrintDeliverySlipsInfra } from "../infra"

import { PrintDeliverySlipsMethod } from "../method"

interface PrintSlips {
    (infra: PrintDeliverySlipsInfra): PrintDeliverySlipsMethod
}
export const printDeliverySlips: PrintSlips = (infra) => async (post) => {
    const { slips, sheet } = infra

    post({ type: "try-to-print" })

    const result = await sheet(slips)
    if (!result.success) {
        return post({ type: "failed-to-print", err: result.err })
    }
    return post({ type: "succeed-to-print", href: result.href })
}
