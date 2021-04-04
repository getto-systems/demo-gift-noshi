import { Workbook } from "exceljs"

type Slip = Readonly<{
    number: string
    type: string
    size: SlipSize
    name: string
}>

type SlipSize = "A3" | "A4"

interface PrintSlips {
    (slips: Slip[]): Promise<string>
}
export function newSheet_deliverySlips(): PrintSlips {
    return async (_slips) => {
        // TODO slips のデータを使ってエクセルを作る
        const workbook = new Workbook()
        workbook.addWorksheet("my sheet")
        const buffer = await workbook.xlsx.writeBuffer()
        const href = URL.createObjectURL(
            new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
        )
        return href
    }
}
