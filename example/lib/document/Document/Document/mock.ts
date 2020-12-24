import { initBreadcrumb } from "../../../example/shared/Outline/breadcrumb/mock"
import { initMenu } from "../../../example/shared/Outline/menu/mock"

import { initContent } from "../content/mock"

import { DocumentFactory } from "./view"

export function newDocumentAsMock(): DocumentFactory {
    return () => {
        return {
            components: {
                menu: initMenu(),
                breadcrumb: initBreadcrumb(),
                content: initContent(),
            },
            terminate: () => {
                // mock では何もしない
            }
        }
    }
}