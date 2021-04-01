import { h, VNode } from "preact"

import { field, label_text_fill } from "../../../../z_vendor/getto-css/preact/design/form"

import { InputBoardComponent } from "../../../../z_vendor/getto-application/board/action_input/x_preact/input"

import { InputNoshiNameResource } from "../resource"

type Props = InputNoshiNameResource
export function InputNoshiNameComponent(props: Props): VNode {
    return label_text_fill(content())

    function content() {
        return field({
            title: "名入れ",
            body: h(InputBoardComponent, props.field.board),
        })
    }
}
