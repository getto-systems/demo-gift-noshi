import {
    LoginIDFormFieldComponentFactory,
    LoginIDFormFieldComponent,
    LoginIDFormFieldMaterial,
} from "./component"

import {
    FormFieldEmptyState,
    FormFieldHandler,
    FormInputComponent,
} from "../../../../../sub/getto-form/x_components/Form/component"
import { FormFieldBaseComponent } from "../../../../../sub/getto-form/x_components/Form/impl"
import { LoginIDValidationError } from "../../../../common/field/loginID/data"

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