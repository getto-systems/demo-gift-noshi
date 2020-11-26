import { DocumentComponentSet } from "../view"

import { MenuComponentFactory } from "../../../System/component/menu/component"
import { BreadcrumbComponentFactory } from "../../../System/component/breadcrumb/component"

import { ContentComponentFactory } from "../../component/content/component"

import { LoadApiNonce, LoadApiRoles } from "../../../credential/action"
import { LoadBreadcrumb, LoadMenu, MenuTargetCollector, ToggleMenuExpand } from "../../../menu/action"

import { DocumentPathCollector, LoadDocument } from "../../../content/action"

export type DocumentFactorySet = Readonly<{
    actions: Readonly<{
        credential: Readonly<{
            loadApiNonce: LoadApiNonce
            loadApiRoles: LoadApiRoles
        }>
        menu: Readonly<{
            loadBreadcrumb: LoadBreadcrumb
            loadMenu: LoadMenu
            toggleMenuExpand: ToggleMenuExpand
        }>
        content: Readonly<{
            loadDocument: LoadDocument
        }>
    }>
    components: Readonly<{
        menu: MenuComponentFactory
        breadcrumb: BreadcrumbComponentFactory

        content: ContentComponentFactory
    }>
}>
export type DocumentCollectorSet = Readonly<{
    menu: MenuTargetCollector
    content: DocumentPathCollector
}>
export function initDocumentComponentSet(
    factory: DocumentFactorySet,
    collector: DocumentCollectorSet
): DocumentComponentSet {
    const actions = {
        loadApiNonce: factory.actions.credential.loadApiNonce(),
        loadApiRoles: factory.actions.credential.loadApiRoles(),

        loadBreadcrumb: factory.actions.menu.loadBreadcrumb(collector.menu),
        loadMenu: factory.actions.menu.loadMenu(collector.menu),
        toggleMenuExpand: factory.actions.menu.toggleMenuExpand(),

        loadDocument: factory.actions.content.loadDocument(collector.content),
    }
    return {
        menu: factory.components.menu(actions),
        breadcrumb: factory.components.breadcrumb(actions),

        content: factory.components.content(actions),
    }
}
