import {
    LoadApplicationComponent,
    LoadApplicationState,
    LoadApplicationComponentOperation,
} from "../../../auth/component/load_application/component"

export function newLoadApplicationComponent(): LoadApplicationComponent {
    return new Component(new Init().failedToLoad_not_found())
}

class Init {
    failedToLoad_not_found(): LoadApplicationState {
        return { type: "failed-to-load", err: { type: "not-found" } }
    }
}

class Component implements LoadApplicationComponent {
    state: LoadApplicationState

    constructor(state: LoadApplicationState) {
        this.state = state
    }

    hook(_stateChanged: Post<LoadApplicationState>): void {
        // mock では特に何もしない
    }
    onStateChange(stateChanged: Post<LoadApplicationState>): void {
        stateChanged(this.state)
    }
    terminate(): void {
        // mock では特に何もしない
    }
    trigger(_operation: LoadApplicationComponentOperation): Promise<void> {
        // mock では特に何もしない
        return Promise.resolve()
    }
}

interface Post<T> {
    (state: T): void
}
