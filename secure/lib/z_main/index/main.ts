import { render, h } from "preact"

import { newDashboardAsSingle } from "../../document/Dashboard/Dashboard/main"

import { Dashboard } from "../../x_preact/document/Dashboard/Dashboard"

render(h(Dashboard, { dashboard: newDashboardAsSingle() }), document.body)
