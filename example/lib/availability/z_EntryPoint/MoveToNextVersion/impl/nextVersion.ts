import { FindPod, FindLocationDetecter } from "../../../nextVersion/action"
import { NextVersionComponentFactory } from "../../../x_Resource/MoveToNextVersion/nextVersion/component"
import { NextVersionResource } from "../entryPoint"

export type NextVersionFactory = Readonly<{
    actions: Readonly<{
        nextVersion: Readonly<{
            find: FindPod
        }>
    }>
    components: Readonly<{
        nextVersion: NextVersionComponentFactory
    }>
}>
export type NextVersionLocationInfo = Readonly<{
    nextVersion: FindLocationDetecter
}>
export function initNextVersionResource(
    factory: NextVersionFactory,
    locationInfo: NextVersionLocationInfo
): NextVersionResource {
    const actions = {
        find: factory.actions.nextVersion.find(locationInfo.nextVersion),
    }
    return {
        nextVersion: factory.components.nextVersion(actions),
    }
}
