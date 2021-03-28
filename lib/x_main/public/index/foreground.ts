import { render, h } from "preact"

import { newDashboardView } from "../../../example/action_dashboard/init"

import { DashboardEntry } from "../../../example/action_dashboard/x_preact/dashboard"

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
