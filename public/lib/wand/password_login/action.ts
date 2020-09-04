import { LoginIDBoard } from "../credential/data";
import { LoginIDRecord } from "../credential/action";
import { PasswordBoard } from "../password/data";
import { PasswordRecord } from "../password/action";
import { LoginBoard, LoginContent, ValidContent, LoginState } from "./data";

export interface PasswordLoginAction {
    initLoginStore(loginID: LoginIDRecord, password: PasswordRecord): LoginStore
    initLoginApi(): LoginApi
}

export interface PasswordLoginTransition {
    logined(): void
}

export interface LoginStore {
    loginID(): LoginIDRecord
    password(): PasswordRecord

    currentBoard(): LoginBoard

    mapLoginID(loginID: LoginIDBoard): LoginBoard
    mapPassword(password: PasswordBoard): LoginBoard

    content(): ValidContent<LoginContent>
    clear(): LoginBoard
}

export interface LoginApi {
    currentState(): LoginState
    login(content: LoginContent): LoginState
}
