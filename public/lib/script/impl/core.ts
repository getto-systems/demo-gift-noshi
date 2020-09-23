import { Infra } from "../infra"

import { initScriptPath, pagePathnameToString } from "../adapter"

import { ScriptAction, ScriptEventPublisher, ScriptEventSubscriber } from "../action"

import { PagePathname, ScriptPath, ScriptEvent } from "../data"

export function initScriptAction(infra: Infra): ScriptAction {
    return new Action(infra)
}

class Action implements ScriptAction {
    infra: Infra

    pub: ScriptEventPublisher
    sub: ScriptEventSubscriber

    constructor(infra: Infra) {
        this.infra = infra

        const pubsub = new EventPubSub()
        this.pub = pubsub
        this.sub = pubsub
    }

    async load(pagePathname: PagePathname): Promise<void> {
        const dispatch = (event: ScriptEvent) => this.pub.dispatchScriptEvent(event)

        const scriptPath = secureScriptPath(this.infra.hostConfig.secureServerHost, pagePathname)
        dispatch({ type: "try-to-load", scriptPath })

        const response = await this.infra.checkClient.checkStatus(scriptPath)
        if (!response.success) {
            dispatch({ type: "failed-to-load", err: response.err })
        }
    }
}

function secureScriptPath(secureHost: string, pagePathname: PagePathname): ScriptPath {
    // secure host にアクセス中の html と同じパスで js がホストされている
    return initScriptPath(`//${secureHost}${pagePathnameToString(pagePathname).replace(/\.html$/, ".js")}`)
}

class EventPubSub implements ScriptEventPublisher, ScriptEventSubscriber {
    listener: {
        script: Publisher<ScriptEvent>[]
    }

    constructor() {
        this.listener = {
            script: [],
        }
    }

    onScriptEvent(pub: Publisher<ScriptEvent>): void {
        this.listener.script.push(pub)
    }

    dispatchScriptEvent(event: ScriptEvent): void {
        this.listener.script.forEach(pub => pub(event))
    }
}

interface Publisher<T> {
    (state: T): void
}
