import { render, h } from "preact"

import { newPrintView } from "../../../noshi/action_print/init"

import { PrintEntry } from "../../../noshi/action_print/x_preact/print"

render(
    h(
        PrintEntry,
        newPrintView({
            webStorage: localStorage,
            currentLocation: location,
        }),
    ),
    document.body,
)
