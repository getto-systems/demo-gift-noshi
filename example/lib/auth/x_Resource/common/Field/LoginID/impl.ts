import {
    LoginIDFormFieldComponentFactory,
    LoginIDFormFieldComponent,
    LoginIDFormFieldMaterial,
} from "./component"

import {
    FormFieldEmptyState,
    FormFieldHandler,
    FormInputComponent,
} from "../../../../../common/getto-form/x_Resource/Form/component"
import { FormFieldBaseComponent } from "../../../../../common/getto-form/x_Resource/Form/impl"
import { LoginIDValidationError } from "../../../../../common/auth/field/loginID/data"

export const initLoginIDFormFieldComponent: LoginIDFormFieldComponentFactory = (material) => (handler) =>
    new FieldComponent(material, handler)

class FieldComponent
    extends FormFieldBaseComponent<FormFieldEmptyState, LoginIDValidationError>
    implements LoginIDFormFieldComponent {
    readonly input: FormInputComponent

    constructor(material: LoginIDFormFieldMaterial, handler: FormFieldHandler) {
        super(handler, {
            state: () => ({ result: material.loginID.validate() }),
        })
        this.input = this.initInput("input", material.loginID)

        this.terminateHook(() => this.input.terminate())
    }
}