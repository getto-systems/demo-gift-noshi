import { initPasswordResetWorkerComponent } from "../../../auth/component/password_reset/impl"

import { PasswordResetComponent } from "../../../auth/component/password_reset/component"

export function newPasswordResetComponent(): PasswordResetComponent {
    return initPasswordResetWorkerComponent(
        () => new Worker("./auth/password_reset.js"),
    )
}
