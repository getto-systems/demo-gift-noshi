import { mockLoadBreadcrumbListResource } from "../../outline/action_load_breadcrumb_list/mock"
import { mockLoadMenuResource } from "../../outline/action_load_menu/mock"

import { DocsResource } from "./resource"

export function mockDocsResource(): DocsResource {
    return {
        ...mockLoadBreadcrumbListResource(),
        ...mockLoadMenuResource(),
    }
}
