import { standard_MenuTree } from "../kernel/impl/test_helper"
import { initLoadMenuLocationDetecter } from "../kernel/init/testHelper"

import { initLoadBreadcrumbListCoreAction, initLoadBreadcrumbListCoreMaterial } from "./core/impl"

import { LoadBreadcrumbListResource } from "./resource"

describe("LoadBreadcrumbList", () => {
    test("load breadcrumb", () => {
        const { resource } = standard_elements()

        expect(resource.breadcrumbList.load()).toEqual([
            category("MAIN"),
            item("ホーム", "home", "/1.0.0/index.html"),
        ])
    })

    test("load empty breadcrumb; unknown menu target", () => {
        const { resource } = unknownTarget_elements()

        expect(resource.breadcrumbList.load()).toEqual([])
    })

    function category(label: string) {
        return { type: "category", category: { label } }
    }
    function item(label: string, icon: string, href: string) {
        return { type: "item", item: { label, icon, href } }
    }
})

function standard_elements() {
    const resource = newResource(standard_URL())

    return { resource }
}
function unknownTarget_elements() {
    const resource = newResource(unknownTarget_URL())

    return { resource }
}

function newResource(currentURL: URL): LoadBreadcrumbListResource {
    const version = standard_version()
    return {
        breadcrumbList: initLoadBreadcrumbListCoreAction(
            initLoadBreadcrumbListCoreMaterial(
                {
                    version,
                    menuTree: standard_MenuTree(),
                },
                initLoadMenuLocationDetecter(currentURL, version),
            ),
        ),
    }
}

function standard_version(): string {
    return "1.0.0"
}

function standard_URL(): URL {
    return new URL("https://example.com/1.0.0/index.html")
}
function unknownTarget_URL(): URL {
    return new URL("https://example.com/1.0.0/unknown.html")
}
