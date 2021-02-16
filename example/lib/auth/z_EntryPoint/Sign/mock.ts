import { MockComponent, MockPropsPasser } from "../../../vendor/getto-example/Application/mock"

import {
    initMockAuthSignRenewResource,
    AuthSignRenewMockPropsPasser,
} from "./resources/Renew/mock"
import {
    initMockAuthSignPasswordLoginResource,
    AuthSignPasswordLoginMockPropsPasser,
} from "./resources/Password/Login/mock"
import {
    initMockPasswordResetSessionResource,
    PasswordResetSessionResourceMockPropsPasser,
} from "../../x_Resource/sign/PasswordResetSession/mock"
import {
    initMockPasswordResetResource,
    PasswordResetResourceMockPropsPasser,
} from "../../x_Resource/sign/PasswordReset/mock"

import {
    AuthSignEntryPoint,
    AuthSignView,
    AuthSignViewState,
    PasswordLoginEntryPoint,
    RenewCredentialEntryPoint,
    PasswordResetSessionEntryPoint,
    PasswordResetEntryPoint,
} from "./entryPoint"
import { AuthSignLinkResource } from "./resources/Link/resource"
import { initAuthSignLinkResource } from "./resources/Link/impl"

export function initMockRenewCredentialEntryPoint(
    passer: AuthSignRenewMockPropsPasser
): RenewCredentialEntryPoint {
    return initEntryPoint(initMockAuthSignRenewResource(passer))
}

export function initMockPasswordLoginEntryPoint(
    passer: AuthSignPasswordLoginMockPropsPasser
): PasswordLoginEntryPoint {
    return initEntryPoint(initMockAuthSignPasswordLoginResource(passer))
}

export function initMockPasswordResetSessionEntryPoint(
    passer: PasswordResetSessionResourceMockPropsPasser
): PasswordResetSessionEntryPoint {
    return initEntryPoint(initMockPasswordResetSessionResource(passer))
}

export function initMockPasswordResetEntryPoint(
    passer: PasswordResetResourceMockPropsPasser
): PasswordResetEntryPoint {
    return initEntryPoint(initMockPasswordResetResource(passer))
}

type EntryPoint<R> = Readonly<{
    resource: R
    terminate: Terminate
}>
interface Terminate {
    (): void
}

function initEntryPoint<R>(resource: R): EntryPoint<R & AuthSignLinkResource> {
    return {
        resource: { ...resource, ...initAuthSignLinkResource() },
        terminate,
    }
}

export function initMockLoginEntryPointAsError(passer: LoginErrorMockPropsPasser): AuthSignEntryPoint {
    return {
        view: new MockErrorView(passer),
        terminate,
    }
}

export type LoginErrorMockPropsPasser = MockPropsPasser<LoginErrorMockProps>
export type LoginErrorMockProps = Readonly<{ error: string }>

class MockErrorView extends MockComponent<AuthSignViewState> implements AuthSignView {
    constructor(passer: LoginErrorMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(err: LoginErrorMockProps): AuthSignViewState {
            return { type: "error", err: err.error }
        }
    }

    load(): void {
        // mock では特に何もしない
    }
}

function terminate() {
    // mock では特に何もしない
}
