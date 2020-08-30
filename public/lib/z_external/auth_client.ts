import { decodeBase64StringToUint8Array, encodeUint8ArrayToBase64String } from "./protocol_buffers_util";
import { ApiCredentialMessage } from "../y_static/auth/credential_pb.js";
import { PasswordLoginMessage } from "../y_static/auth/password_login_pb.js";

export interface AuthClient {
    renew(param: RenewParam): Promise<Credential>;
    passwordLogin(param: PasswordLoginParam): Promise<Credential>;
}

export type RenewParam = Readonly<{ nonce: string }>
export type PasswordLoginParam = Readonly<{ loginID: string, password: string }>

type Credential = Readonly<{
    nonce: string,
    roles: Array<string>,
}>

export function initAuthClient(authServerURL: string): AuthClient {
    return new AuthClientImpl(authServerURL);
}

class AuthClientImpl implements AuthClient {
    authServerURL: string;

    constructor(authServerURL: string) {
        this.authServerURL = authServerURL;
    }

    async renew(params: RenewParam): Promise<Credential> {
        const response = await fetch(this.authServerURL, {
            method: "POST",
            credentials: "include",
            headers: requestHeaders("Renew", {
                "X-GETTO-EXAMPLE-ID-TICKET-NONCE": params.nonce,
            }),
        });

        return await parseResponse(response);
    }

    async passwordLogin(params: PasswordLoginParam): Promise<Credential> {
        const response = await fetch(this.authServerURL, {
            method: "POST",
            credentials: "include",
            headers: requestHeaders("PasswordLogin", {}),
            body: (() => {
                const f = PasswordLoginMessage;
                const passwordLogin = new f();

                passwordLogin.loginId = params.loginID;
                passwordLogin.password = params.password;

                const arr = f.encode(passwordLogin).finish();
                return encodeUint8ArrayToBase64String(arr);
            })(),
        });

        return await parseResponse(response);
    }
}

function requestHeaders(handler: string, additional_headers: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
        "X-GETTO-EXAMPLE-ID-HANDLER": handler,
    }

    for (const key in additional_headers) {
        headers[key] = additional_headers[key];
    }

    return headers;
}

async function parseResponse(response: Response): Promise<Credential> {
    if (!response.ok) {
        const body = await response.json();
        if (typeof body.message === "string") {
            throw body.message;
        } else {
            throw "server-error";
        }
    }

    try {
        const nonce = response.headers.get("X-GETTO-EXAMPLE-ID-TICKET-NONCE");
        const credential = response.headers.get("X-GETTO-EXAMPLE-ID-API-CREDENTIAL");

        if (!nonce) {
            throw "nonce is empty";
        }
        if (!credential) {
            throw "roles is empty";
        }

        const apiCredential = ApiCredentialMessage.decode(decodeBase64StringToUint8Array(credential));

        return {
            nonce: nonce,
            roles: apiCredential.roles ? apiCredential.roles : [],
        }
    } catch (err) {
        // TODO ここでエラーを握りつぶさない方法を考えたい
        throw "bad-response";
    }
}
