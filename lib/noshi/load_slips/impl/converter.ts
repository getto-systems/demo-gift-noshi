import { ConvertLocationResult } from "../../../z_vendor/getto-application/location/data"
import { DeliverySlipNumber } from "../data"

export function deliverySlipNumberLocationConverter(
    currentURL: URL,
): ConvertLocationResult<DeliverySlipNumber> {
    const number = currentURL.searchParams.get("number")
    if (!number) {
        return { valid: false }
    }
    return { valid: true, value: markDeliverySlipNumber(number) }
}

function markDeliverySlipNumber(number: string): DeliverySlipNumber {
    return number as DeliverySlipNumber
}
