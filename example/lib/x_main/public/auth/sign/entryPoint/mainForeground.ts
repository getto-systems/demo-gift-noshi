import { render, h } from "preact"

import { newWorker } from "../../../../../z_getto/application/init/worker"
import { newWorkerForeground } from "../main/worker/foreground"

import { EntryPoint } from "../x_preact/EntryPoint"

render(
    h(
        EntryPoint,
        newWorkerForeground({
            webStorage: localStorage,
            currentURL: new URL(location.toString()),
            worker: newWorker({
                currentScript: document.currentScript,
            }),
        }),
    ),
    document.body,
)
