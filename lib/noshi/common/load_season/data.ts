import { RepositoryError } from "../../../z_vendor/getto-application/infra/repository/data"

export type Season = Season_data & { Season: never }
type Season_data = Readonly<{
    year: number
}>

export type LoadSeasonResult =
    | Readonly<{ success: true; value: Season }>
    | Readonly<{ success: false; err: RepositoryError }>
