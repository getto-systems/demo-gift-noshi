export type Season = Season_data & { Season: never }
type Season_data = Readonly<{
    year: number
    period: SeasonPeriod
}>
export type SeasonPeriod = "summer" | "winter"
