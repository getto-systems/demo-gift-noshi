import { SeasonPeriod } from "../../load_season/data"

export function seasonPeriod(period: SeasonPeriod): string {
    switch (period) {
        case "summer":
            return "夏"

        case "winter":
            return "冬"
    }
}
