import { FormField, FormInput } from "../../../../z_getto/getto-form/form/action"

import { FormInputString } from "../../../../z_getto/getto-form/form/data"
import { Password } from "../../password/data"
import { PasswordCharacter, PasswordValidationError, PasswordViewState } from "./data"

export type PasswordFormFieldAction = Readonly<{
    field: PasswordFormFieldPod
    character: PasswordCharacterCheckerPod
    viewer: PasswordViewerPod
}>

export interface PasswordFormFieldPod {
    (): PasswordFormField
}
export type PasswordFormField = FormField<Password, PasswordValidationError, FormInput>

export interface PasswordCharacterCheckerPod {
    (): PasswordCharacterChecker
}
export interface PasswordCharacterChecker {
    (password: FormInputString): PasswordCharacter
}

export interface PasswordViewerPod {
    (): PasswordViewer
}
export interface PasswordViewer {
    get(): PasswordViewState
    show(post: Post<PasswordViewState>): void
    hide(post: Post<PasswordViewState>): void
}

interface Post<T> {
    (event: T): void
}
