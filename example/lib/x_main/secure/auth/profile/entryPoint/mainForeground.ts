import { h, render } from "preact"

import { newForeground } from "../main/single"

import { EntryPoint } from "../x_preact/EntryPoint"

render(
    h(
        EntryPoint,
        newForeground({
            webStorage: localStorage,
            currentLocation: location,
        }),
    ),
    document.body,
)
