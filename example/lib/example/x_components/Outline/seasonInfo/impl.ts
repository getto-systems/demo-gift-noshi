import { ApplicationAbstractStateAction } from "../../../../z_getto/application/impl"

import {
    SeasonInfoComponentFactory,
    SeasonInfoMaterial,
    SeasonInfoComponent,
    SeasonInfoComponentState,
} from "./component"

export const initSeasonInfoComponent: SeasonInfoComponentFactory = (material) =>
    new Component(material)

class Component
    extends ApplicationAbstractStateAction<SeasonInfoComponentState>
    implements SeasonInfoComponent {
    material: SeasonInfoMaterial

    constructor(material: SeasonInfoMaterial) {
        super()
        this.material = material

        this.igniteHook(() => {
            this.material.loadSeason(this.post)
        })
    }
}
