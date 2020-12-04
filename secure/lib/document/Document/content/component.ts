import { LoadDocumentAction } from "../../content/action"
import { DocumentPath } from "../../content/data"

export interface ContentComponentFactory {
    (actions: ContentActionSet): ContentComponent
}
export type ContentActionSet = Readonly<{
    loadDocument: LoadDocumentAction
}>

export interface ContentComponent {
    onStateChange(post: Post<ContentState>): void
    load(): void
}

export type ContentState =
    | Readonly<{ type: "initial-content" }>
    | Readonly<{ type: "succeed-to-load"; path: DocumentPath }>

export const initialContentState: ContentState = { type: "initial-content" }

interface Post<T> {
    (state: T): void
}