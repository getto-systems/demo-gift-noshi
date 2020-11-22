import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { unpackSeason } from "../../season/adapter"

import { SeasonComponent, initialSeasonState } from "../../system/component/season/component"

import { Season } from "../../season/data"

type Props = Readonly<{
    season: SeasonComponent
}>

export function SeasonInfo({ season }: Props): VNode {
    const [state, setState] = useState(initialSeasonState)
    useEffect(() => {
        season.onStateChange(setState)
        season.action({ type: "load-season" })
    }, [])

    switch (state.type) {
        case "initial-season":
            return EMPTY_CONTENT

        case "succeed-to-load":
            return content(state.season)
    }
}

function content(season: Season): VNode {
    const { year } = unpackSeason(season)
    return html`
        <section class="menu__box">
            <dl class="form">
                <dt class="form__header">シーズン</dt>
                <dd class="form__field">${year}</dd>
            </dl>
        </section>
    `
}

const EMPTY_CONTENT = html``