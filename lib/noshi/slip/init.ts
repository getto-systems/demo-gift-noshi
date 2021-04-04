import { NoshiName } from "../name/data"
import { DeliverySlipData, DeliverySlipNumber } from "./data"

export function newDeliverySlips(): DeliverySlipData[] {
    return [
        {
            number: markDeliverySlipNumber("0001"),
            name: markNoshiName("鈴木一郎"),
            size: "A4",
            type: "御歳暮",
        },
        {
            number: markDeliverySlipNumber("0002"),
            name: markNoshiName("山田花子"),
            size: "A3",
            type: "内祝",
        },
    ]
}

// ここでデータを初期化するために必要
function markDeliverySlipNumber(number: string): DeliverySlipNumber {
    return number as DeliverySlipNumber
}
function markNoshiName(name: string): NoshiName {
    return name as NoshiName
}
