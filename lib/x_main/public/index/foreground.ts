import { render, h } from "preact"

import { newDashboardView } from "../../../noshi/action_dashboard/init"

import { DashboardEntry } from "../../../noshi/action_dashboard/x_preact/dashboard"

render(
    h(
        DashboardEntry,
        newDashboardView({
            webStorage: localStorage,
            currentLocation: location,
        }),
    ),
    document.body,
)
