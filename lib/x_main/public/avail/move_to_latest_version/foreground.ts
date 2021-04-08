import { h, render } from "preact"

import { foregroundOutsideFeature } from "../../../x_outside_feature/common"

import { newFindNextVersionView } from "../../../../avail/version/action_find_next/init"

import { MoveToLatestVersionEntry } from "../../../../avail/version/action_find_next/x_preact/move_to_latest_version"

render(
    h(MoveToLatestVersionEntry, newFindNextVersionView(foregroundOutsideFeature())),
    document.body,
)
