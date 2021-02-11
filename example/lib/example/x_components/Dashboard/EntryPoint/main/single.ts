import { env } from "../../../../../y_environment/env"

import { DashboardLocationInfo, DashboardFactory, initDashboardResource } from "../impl/core"

import { initErrorComponent } from "../../../../../available/x_components/Error/error/impl"
import { initSeasonInfoComponent } from "../../../Outline/seasonInfo/impl"
import { initMenuListComponent } from "../../../../../auth/x_components/Outline/menuList/impl"
import { initBreadcrumbListComponent } from "../../../../../auth/x_components/Outline/breadcrumbList/impl"
import { initExampleComponent } from "../../example/impl"
import { detectMenuTarget } from "../../../../../auth/x_components/Outline/Menu/impl/location"

import { initNotifyAction } from "../../../../../available/x_components/Error/EntryPoint/main/core"
import {
    initCredentialAction,
    initMainMenuAction,
} from "../../../../../auth/x_components/Outline/Menu/main/core"
import { initSeasonAction } from "../../../Outline/GlobalInfo/main/core"

import { DashboardEntryPoint } from "../entryPoint"

export function newDashboardAsSingle(): DashboardEntryPoint {
    const webStorage = localStorage
    const currentURL = new URL(location.toString())

    const factory: DashboardFactory = {
        actions: {
            notify: initNotifyAction(),
            credential: initCredentialAction(webStorage),
            menu: initMainMenuAction(webStorage),
            season: initSeasonAction(),
        },
        components: {
            error: initErrorComponent,
            menuList: initMenuListComponent,
            breadcrumbList: initBreadcrumbListComponent,
            seasonInfo: initSeasonInfoComponent,

            example: initExampleComponent,
        },
    }
    const locationInfo: DashboardLocationInfo = {
        menu: {
            getMenuTarget: () => detectMenuTarget(env.version, currentURL),
        },
    }
    const resource = initDashboardResource(factory, locationInfo)
    return {
        resource,
        terminate: () => {
            resource.menuList.terminate()
            resource.breadcrumbList.terminate()
            resource.seasonInfo.terminate()

            resource.example.terminate()
        },
    }
}
