import { render, h } from "preact";
import { useState, useEffect } from "preact/hooks";

import { LoadUsecase, initLoad, LoadView } from "../load";

import { CredentialRepository } from "../load/credential/infra";
import { credentialAction } from "../load/credential/core";
import { initMemoryCredential } from "../load/credential/repository/credential/memory";

import { RenewClient } from "../load/renew/infra";
import { renewAction } from "../load/renew/core";
import { initSimulateRenewClient } from "../load/renew/client/renew/simulate";
import { nonceNotFound } from "../load/credential/data";

import { PasswordLoginClient } from "../load/password_login/infra";
import { passwordLoginAction } from "../load/password_login/core";
import { initSimulatePasswordLoginClient } from "../load/password_login/client/password_login/simulate";

import { ScriptEnv, PathnameLocation } from "../load/script/infra";
import { scriptAction } from "../load/script/core";
import { initBrowserLocation } from "../load/script/location/browser";
import { env } from "../y_global/env";

import { NonceValue, ApiRoles } from "../load/credential/data";
import { LoginID, Password } from "../load/password_login/data";

import { LoadScript } from "./load/load_script";
import { PasswordLogin } from "./load/password_login";
import { html } from "htm/preact";

(async () => {
    render(h(main(await initUsecase()), {}), document.body);
})();

function initUsecase(): Promise<LoadUsecase> {
    return initLoad({
        credential: credentialAction({
            credentials: initCredentialRepository(),
        }),
        renew: renewAction({
            renewClient: initRenewClient(),
        }),
        passwordLogin: passwordLoginAction({
            passwordLoginClient: initPasswordLoginClient(),
        }),
        script: scriptAction({
            env: initScriptEnv(),
            location: initPathnameLocation(),
        }),
    });

    function initCredentialRepository(): CredentialRepository {
        return initMemoryCredential(nonceNotFound);
    }

    function initRenewClient(): RenewClient {
        return initSimulateRenewClient(
            simulateNonce(),
            simulateApiRoles(),
        );
    }
    function initPasswordLoginClient(): PasswordLoginClient {
        return initSimulatePasswordLoginClient(
            simulateLoginID(),
            simulatePassword(),
            simulateNonce(),
            simulateApiRoles(),
        )
    }

    function initScriptEnv(): ScriptEnv {
        return {
            secureServer: env.server.secure,
        }
    }
    function initPathnameLocation(): PathnameLocation {
        return initBrowserLocation(location);
    }

    function simulateNonce(): NonceValue {
        return "NONCE";
    }
    function simulateApiRoles(): ApiRoles {
        return ["admin", "development"]
    }
    function simulateLoginID(): LoginID {
        return { loginID: "admin" }
    }
    function simulatePassword(): Password {
        return { password: "password" }
    }
}

function main(load: LoadUsecase) {
    return () => {
        const [view, setView] = useState<LoadView>(load.initial);
        useEffect(() => {
            load.registerTransitionSetter(setView)
        }, []);

        switch (view.name) {
            case "load-script":
                return h(LoadScript(load.initLoadScriptComponent()), {});

            case "password-login":
                return h(PasswordLogin(load.initPasswordLoginComponent()), {});

            case "error":
                return html`なんかえらった: ${view.err}`

            default:
                return assertNever(view)
        }
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
