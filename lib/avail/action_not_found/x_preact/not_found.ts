import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { useApplicationView } from "../../../z_vendor/getto-application/action/x_preact/hooks"

import { loginBox } from "../../../z_vendor/getto-css/preact/layout/login"
import { buttons } from "../../../z_vendor/getto-css/preact/design/form"

import { useDocumentTitle } from "../../../x_preact/hooks"
import { siteInfo } from "../../../noshi/site"
import { icon } from "../../../x_preact/design/icon"

import { ApplicationErrorComponent } from "../../common/x_preact/application_error"

import { NotFoundView, NotFoundResource } from "../resource"

export function NotFoundEntry(view: NotFoundView): VNode {
    const resource = useApplicationView(view)

    const [err] = useErrorBoundary((err) => {
        // 認証していないのでエラーはどうしようもない
        console.log(err)
    })
    if (err) {
        return h(ApplicationErrorComponent, { err: `${err}` })
    }

    return h(NotFoundComponent, resource)
}

type Props = NotFoundResource
export function NotFoundComponent(props: Props): VNode {
    useDocumentTitle("Not Found")

    return loginBox(siteInfo, {
        title: "リンクが切れていました",
        body: [
            html`<p>
                リンクされたページが見つかりませんでした<br />
                これはシステム側の不備です
            </p>`,
            html`<p>
                お手数ですが、管理者にクリックしたリンクをお伝えください<br />
                直前まで行っていた作業も教えていただけると助かります
            </p>`,
            html`<p>作業は左下のリンクからホームに戻って続けられます</p>`,
        ],
        footer: buttons({
            left: [html`<a href="${homeHref()}">${icon("home")} ホームへ</a>`],
        }),
    })

    function homeHref() {
        return `/${props.version.getCurrent()}/index.html`
    }
}
