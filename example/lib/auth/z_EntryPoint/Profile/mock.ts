import { initMockErrorResource } from "../../../availability/x_Resource/Error/mock"
import {
    LogoutResourceMockPropsPasser,
    initMockLogoutResource,
} from "../../x_Resource/Profile/Logout/mock"
import {
    BreadcrumbListMockPropsPasser,
    initMockBreadcrumbListComponent,
} from "../../../common/x_Resource/Outline/Menu/BreadcrumbList/mock"
import {
    initMockMenuComponent,
    MenuMockPropsPasser,
} from "../../../common/x_Resource/Outline/Menu/Menu/mock"
import {
    initMockSeasonInfoComponent,
    SeasonInfoMockPropsPasser,
} from "../../../example/x_components/Outline/seasonInfo/mock"

import { AuthProfileEntryPoint } from "./entryPoint"

export type AuthProfileMockPropsPasser = Readonly<{
    seasonInfo: SeasonInfoMockPropsPasser
    menu: MenuMockPropsPasser
    breadcrumbList: BreadcrumbListMockPropsPasser
    logout: LogoutResourceMockPropsPasser
}>
export function newMockAuthProfile(passer: AuthProfileMockPropsPasser): AuthProfileEntryPoint {
    return {
        resource: {
            ...initMockErrorResource(),
            ...initMockLogoutResource(passer.logout),
            seasonInfo: initMockSeasonInfoComponent(passer.seasonInfo),
            menu: initMockMenuComponent(passer.menu),
            breadcrumbList: initMockBreadcrumbListComponent(passer.breadcrumbList),
        },
        terminate: () => {
            // mock では特に何もしない
        },
    }
}
