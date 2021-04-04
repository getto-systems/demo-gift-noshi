import { NoshiName } from "../name/data"
import { DeliverySlipData, DeliverySlipNumber } from "./data"

export function newDeliverySlips(): DeliverySlipData[] {
    const generator = idGenerator()
    return [
        {
            number: markDeliverySlipNumber(generator()),
            name: markNoshiName("鈴木一郎"),
            size: "A4",
            type: "御歳暮",
        },
        {
            number: markDeliverySlipNumber(generator()),
            name: markNoshiName("佐藤太郎"),
            size: "A4",
            type: "御歳暮",
        },
        {
            number: markDeliverySlipNumber(generator()),
            name: markNoshiName("山田花子"),
            size: "A4",
            type: "内　祝",
        },
        {
            number: markDeliverySlipNumber(generator()),
            name: markNoshiName("鈴木一郎"),
            size: "A3",
            type: "御歳暮",
        },
        {
            number: markDeliverySlipNumber(generator()),
            name: markNoshiName("佐藤太郎"),
            size: "A3",
            type: "御歳暮",
        },
        {
            number: markDeliverySlipNumber(generator()),
            name: markNoshiName("山田花子"),
            size: "A3",
            type: "内　祝",
        },
    ]
}

function idGenerator(): { (): number } {
    let id = 0
    return () => {
        id++
        return id
    }
}

// ここでデータを初期化するために必要
function markDeliverySlipNumber(number: number): DeliverySlipNumber {
    return `${number}` as DeliverySlipNumber
}
function markNoshiName(name: string): NoshiName {
    return name as NoshiName
}
