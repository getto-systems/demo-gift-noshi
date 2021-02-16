import { MenuForegroundAction, MenuResource } from "../../../common/x_Resource/Outline/Menu/resource"
import { AuthProfileLogoutMaterial, AuthProfileLogoutResource } from "./resources/Logout/resource"

import {
    SeasonInfoComponent,
    SeasonInfoComponentFactory,
} from "../../../example/x_components/Outline/seasonInfo/component"

import { SeasonAction } from "../../../example/shared/season/action"
import { ErrorForegroundAction, ErrorResource } from "../../../availability/x_Resource/Error/resource"

export type AuthProfileEntryPoint = Readonly<{
    resource: AuthProfileResource
    terminate: Terminate
}>

export type AuthProfileResource = Readonly<{
    seasonInfo: SeasonInfoComponent
}> &
    ErrorResource &
    MenuResource &
    AuthProfileLogoutResource

export type AuthProfileMaterial = ErrorForegroundAction &
    MenuForegroundAction &
    AuthProfileLogoutMaterial

export type ProfileFactory = Readonly<{
    actions: Readonly<{
        season: SeasonAction
    }> &
        AuthProfileMaterial
    components: Readonly<{
        seasonInfo: SeasonInfoComponentFactory
    }>
}>

interface Terminate {
    (): void
}
