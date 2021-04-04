export type NextDeliverySlipHref =
    | Readonly<{ hasNext: false }>
    | Readonly<{ hasNext: true; href: string }>

export type LoadCurrentDeliverySlipError =
    | Readonly<{ type: "empty" }>
    | Readonly<{ type: "not-found" }>
