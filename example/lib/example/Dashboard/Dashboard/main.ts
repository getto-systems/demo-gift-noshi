import { env } from "../../../y_static/env"

import { initSeason } from "../../shared/Outline/season/impl"
import { initMenu } from "../../shared/Outline/menu/impl"
import { initBreadcrumb } from "../../shared/Outline/breadcrumb/impl"
import { initExample } from "../example/impl"

import { detectMenuTarget } from "../../shared/Outline/MenuTarget/impl/location"

import { loadApiNonce, loadApiRoles } from "../../shared/credential/impl/core"
import { mainMenuTree } from "../../shared/menu/impl/tree"

import { initDashboardAsSingle } from "./impl/single"

import { DashboardFactory } from "./view"
import { loadSeason } from "../../shared/season/impl/core"
import { loadBreadcrumb, loadMenu, toggleMenuExpand } from "../../shared/menu/impl/core"

import { MenuBadgeMap } from "../../shared/menu/infra"

import { initMemoryApiCredentialRepository } from "../../shared/credential/impl/repository/api_credential/memory"
import { initMemorySeasonRepository } from "../../shared/season/impl/repository/season/memory"
import { initDateYearRepository } from "../../shared/season/impl/repository/year/date"
import { initSimulateBadgeClient } from "../../shared/menu/impl/client/badge/simulate"
import { initStorageMenuExpandRepository } from "../../shared/menu/impl/repository/expand/storage"

import { markSeason } from "../../shared/season/data"
import { markApiNonce, markApiRoles } from "../../shared/credential/data"

export function newDashboardAsSingle(): DashboardFactory {
    const menuExpandStorage = localStorage
    const currentLocation = location

    const factory = {
        actions: {
            credential: initCredentialAction(),
            menu: initMenuAction(menuExpandStorage),
            season: initSeasonAction(),
        },
        components: {
            season: initSeason,
            menu: initMenu,
            breadcrumb: initBreadcrumb,

            example: initExample,
        },
    }
    const collector = {
        menu: {
            getMenuTarget: () => detectMenuTarget(env.version, currentLocation),
        },
    }
    return () => initDashboardAsSingle(factory, collector)
}

function initCredentialAction() {
    const apiCredentials = initMemoryApiCredentialRepository(
        markApiNonce("api-nonce"),
        markApiRoles(["admin"])
    )

    return {
        loadApiNonce: loadApiNonce({ apiCredentials }),
        loadApiRoles: loadApiRoles({ apiCredentials }),
    }
}
function initMenuAction(menuExpandStorage: Storage) {
    const tree = mainMenuTree()
    const badge = initSimulateBadgeClient(new MenuBadgeMap())
    const expands = initStorageMenuExpandRepository(menuExpandStorage, env.storageKey.menuExpand.main)

    return {
        loadBreadcrumb: loadBreadcrumb({ tree }),
        loadMenu: loadMenu({ tree, badge, expands }),
        toggleMenuExpand: toggleMenuExpand({ expands }),
    }
}
function initSeasonAction() {
    return {
        loadSeason: loadSeason({
            seasons: initMemorySeasonRepository(markSeason({ year: new Date().getFullYear() })),
            years: initDateYearRepository(new Date()),
        }),
    }
}