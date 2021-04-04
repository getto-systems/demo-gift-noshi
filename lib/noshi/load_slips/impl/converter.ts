import { ConvertLocationResult } from "../../../z_vendor/getto-application/location/data"
import { DeliverySlipData, DeliverySlipNumber } from "../data"

const SEARCH_KEY = {
    number: "number",
} as const

export function deliverySlipNumberLocationConverter(
    currentURL: URL,
): ConvertLocationResult<DeliverySlipNumber> {
    const number = currentURL.searchParams.get(SEARCH_KEY.number)
    if (!number) {
        return { valid: false }
    }
    return { valid: true, value: markDeliverySlipNumber(number) }
}
export function deliverySlipHrefConverter(slip: DeliverySlipData): string {
    return `?${SEARCH_KEY.number}=${slip.number}`
}

function markDeliverySlipNumber(number: string): DeliverySlipNumber {
    return number as DeliverySlipNumber
}
