import { newAuthSignLinkResource } from "./impl"

describe("AuthSignLink", () => {
    test("link", () => {
        const resource = newAuthSignLinkResource()

        expect(resource.href.passwordLogin()).toEqual("?_password_login")
        expect(resource.href.passwordResetSession()).toEqual("?_password_reset=start")
    })
})