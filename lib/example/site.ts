export type SiteInfo = Readonly<{
    brand: string
    title: string
    subTitle: string
}>

export function siteInfo(): SiteInfo {
    return {
        brand: "GETTO",
        title: "Example",
        subTitle: "code templates",
    }
}

export function copyright(): string {
    return "GETTO.systems"
}

export function poweredBy(): string[] {
    return ["LineIcons", "みんなの文字"]
}
