export type SiteInfo = Readonly<{
    brand: string
    title: string
    subTitle: string
}>

export const siteInfo: SiteInfo = {
    brand: "ギフト",
    title: "のし印刷",
    subTitle: "プレビュー",
}

export const copyright = "GETTO.systems" as const
export const poweredBy = ["LineIcons", "みんなの文字"] as const
