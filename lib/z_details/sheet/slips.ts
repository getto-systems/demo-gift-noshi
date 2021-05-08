import { env } from "../../y_environment/env"
import { PaperSize, Workbook } from "exceljs"

type Slip = Readonly<{ size: SlipSize }> & SlipData
type SlipData = Readonly<{
    type: string
    name: string
}>

type SlipSize = "A3" | "A4"

type HeightMap = Readonly<{
    type: number
    padding: number
    name: number
}>

interface AddSlip {
    (data: SlipData): void
}

type Grouped = Map<SlipSize, SlipData[]>

interface PrintSlips {
    (slips: Slip[]): Promise<string>
}
export function newSheet_deliverySlips(): PrintSlips {
    return async (slips) => {
        const mock = true
        if (mock) {
            return `/${env.version}/noshi.xlsx`
        }
        const workbook = new Workbook()

        Array.from(
            slips
                .reduce((acc, slip): Grouped => {
                    const grouped = acc.get(slip.size)
                    if (!grouped) {
                        acc.set(slip.size, [slip])
                    } else {
                        grouped.push(slip)
                    }
                    return acc
                }, <Grouped>new Map())
                .entries(),
        ).forEach((entry) => {
            const [size, grouped] = entry
            const addSlip = sheet(workbook, size)
            grouped.forEach(addSlip)
        })

        const buffer = await workbook.xlsx.writeBuffer()
        return URL.createObjectURL(
            new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
        )
    }

    function sheet(workbook: Workbook, size: SlipSize): AddSlip {
        switch (size) {
            case "A3":
                return sheet_A3(workbook)

            case "A4":
                return sheet_A4(workbook)
        }
    }
    function sheet_A4(workbook: Workbook): AddSlip {
        const sheet = workbook.addWorksheet("A4")

        sheet.properties.defaultRowHeight = BASE_HEIGHT

        sheet.pageSetup.orientation = "landscape"
        sheet.pageSetup.paperSize = PaperSize.A4
        sheet.pageSetup.horizontalDpi = 1200
        sheet.pageSetup.verticalDpi = 1200
        sheet.pageSetup.horizontalCentered = true
        sheet.pageSetup.margins = {
            top: 0.25,
            bottom: 0.25,
            left: 0,
            right: 0,
            header: 0,
            footer: 0,
        }
        sheet.pageSetup.blackAndWhite = true
        sheet.pageSetup.fitToPage = true
        sheet.pageSetup.fitToWidth = 1
        sheet.pageSetup.fitToHeight = 3

        const column = sheet.getColumn("A")
        column.width = 13
        column.font = {
            name: "HG正楷書体-PRO",
            family: 1,
            size: 60,
            bold: true,
        }
        column.alignment = {
            horizontal: "center",
            vertical: "middle",
            textRotation: "vertical",
            shrinkToFit: true,
        }

        const height: HeightMap = {
            type: 15,
            padding: 6,
            name: 22,
        }

        return (data: SlipData): void => {
            const type = sheet.addRow([data.type])
            type.height = rowHeight(height.type)

            const padding = sheet.addRow([""])
            padding.height = rowHeight(height.padding)

            const name = sheet.addRow([data.name])
            name.height = rowHeight(height.name)

            name.addPageBreak()
        }
    }
    function sheet_A3(workbook: Workbook): AddSlip {
        const sheet = workbook.addWorksheet("A3")

        sheet.properties.defaultRowHeight = BASE_HEIGHT

        sheet.pageSetup.orientation = "landscape"
        sheet.pageSetup.paperSize = 8 // A3
        sheet.pageSetup.horizontalDpi = 1200
        sheet.pageSetup.verticalDpi = 1200
        sheet.pageSetup.horizontalCentered = true
        sheet.pageSetup.margins = {
            top: 0.75,
            bottom: 0.75,
            left: 0,
            right: 0,
            header: 0,
            footer: 0,
        }
        sheet.pageSetup.blackAndWhite = true
        sheet.pageSetup.fitToWidth = 1

        const column = sheet.getColumn("A")
        column.width = 16.88
        column.font = {
            name: "HG正楷書体-PRO",
            family: 1,
            size: 75,
            bold: true,
        }
        column.alignment = {
            horizontal: "center",
            vertical: "middle",
            textRotation: "vertical",
            shrinkToFit: true,
        }

        const height: HeightMap = {
            type: 22,
            padding: 8,
            name: 26,
        }

        return (data: SlipData): void => {
            const type = sheet.addRow([data.type])
            type.height = rowHeight(height.type)

            const padding = sheet.addRow([""])
            padding.height = rowHeight(height.padding)

            const name = sheet.addRow([data.name])
            name.height = rowHeight(height.name)

            name.addPageBreak()
        }
    }
}

function rowHeight(height: number): number {
    return height * BASE_HEIGHT
}
const BASE_HEIGHT = 13.5
