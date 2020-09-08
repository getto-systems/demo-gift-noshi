import { initAuthClient, AuthClient } from "../z_external/auth_client/auth_client";

import { AuthAction } from "../auth/action";

import { AuthUsecase, initAuthUsecase } from "../auth";

import { initStorageAuthCredentialRepository } from "../ability/auth_credential/repository/credential/storage";
import { initFetchRenewClient } from "../ability/auth_credential/client/renew/fetch";
import { initBrowserPathnameLocation } from "../ability/script/location/browser";
//import { initFetchPasswordLoginClient } from "../ability/password_login/client/password_login/fetch";
//import { initSimulatePasswordResetClient } from "../ability/password_reset/client/password_reset/simulate";
import { env } from "../y_static/env";

import { AuthCredentialRepository, RenewClient } from "../ability/auth_credential/infra";
import { ScriptEnv, PathnameLocation } from "../ability/script/infra";
//import { PasswordLoginClient } from "../ability/password_login/infra";
//import { PasswordResetClient } from "../ability/password_reset/infra";

import { initAuthCredentialAction } from "../ability/auth_credential/core";
import { initScriptAction } from "../ability/script/core";
//import { initPasswordAction } from "../ability/password/core";
//import { initPasswordLoginAction } from "../ability/password_login/core";
//import { initPasswordResetAction } from "../ability/password_reset/core";

export function init(browserLocation: Location, storage: Storage): AuthUsecase {
    const url = new URL(browserLocation.toString());
    return initAuthUsecase(url, initAuthAction());

    function initAuthAction(): AuthAction {
        const authClient = initAuthClient(env.authServerURL);

        return {
            authCredential: initAuthCredentialAction({
                authCredentials: initAuthCredentialRepository(),
                renewClient: initRenewClient(authClient),
            }),
            script: initScriptAction({
                env: initScriptEnv(),
                location: initPathnameLocation(browserLocation),
            }),
            /*
            password: initPasswordAction(),
            passwordLogin: initPasswordLoginAction({
                passwordLoginClient: initPasswordLoginClient(authClient),
            }),
            passwordReset: initPasswordResetAction({
                passwordResetClient: initPasswordResetClient(),
            }),
             */
        }
    }

    function initAuthCredentialRepository(): AuthCredentialRepository {
        return initStorageAuthCredentialRepository(storage, "GETTO-EXAMPLE-CREDENTIAL");
    }

    function initRenewClient(authClient: AuthClient): RenewClient {
        return initFetchRenewClient(authClient);
    }

    function initScriptEnv(): ScriptEnv {
        return {
            secureServerHost: env.secureServerHost,
        }
    }
    function initPathnameLocation(browserLocation: Location): PathnameLocation {
        return initBrowserPathnameLocation(browserLocation);
    }

    /*
    function initPasswordLoginClient(authClient: AuthClient): PasswordLoginClient {
        return initFetchPasswordLoginClient(authClient);
    }
    function initPasswordResetClient(): PasswordResetClient {
        return initSimulatePasswordResetClient(
            { loginID: "admin" },
            {
                ticketNonce: { ticketNonce: "ticket-nonce" },
                apiCredential: {
                    apiRoles: { apiRoles: ["admin", "development"] },
                },
            },
        );
    }

     */
}