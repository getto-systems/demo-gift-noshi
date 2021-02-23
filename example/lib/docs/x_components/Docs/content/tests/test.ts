import { DocumentRemoteAccess, newTestDocumentResource } from "../../EntryPoint/tests/core"

import { initMemoryTypedStorage } from "../../../../../z_getto/storage/typed/memory"
import { initLoadOutlineMenuBadgeSimulateRemoteAccess } from "../../../../../auth/permission/outline/load/infra/remote/loadOutlineMenuBadge/simulate"
import { initOutlineMenuExpandRepository } from "../../../../../auth/permission/outline/load/infra/repository/outlineMenuExpand/core"

import { OutlineMenuTree } from "../../../../../auth/permission/outline/load/infra"

import { ContentComponentState } from "../component"
import { initMemoryApiCredentialRepository } from "../../../../../common/apiCredential/infra/repository/memory"
import { markApiNonce, markApiRoles } from "../../../../../common/apiCredential/data"

describe("Content", () => {
    test("load content", (done) => {
        const { resource } = standardResource()

        const ignition = resource.content.ignition()
        ignition.subscribe(stateHandler())

        ignition.ignite()

        function stateHandler(): Post<ContentComponentState> {
            const stack: ContentComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-content":
                        // work in progress...
                        break

                    case "succeed-to-load":
                        expect(stack).toEqual([
                            { type: "succeed-to-load", path: "/docs/index.html" },
                        ])
                        done()
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })
})

function standardResource() {
    const version = standardVersion()
    const url = standardURL()
    const menuTree = standardMenuTree()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const resource = newTestDocumentResource(version, url, menuTree, repository, simulator)

    return { repository, resource }
}

function standardVersion(): string {
    return "1.0.0"
}

function standardURL(): URL {
    return new URL("https://example.com/1.0.0/docs/index.html")
}

function standardMenuTree(): OutlineMenuTree {
    return []
}

function standardRepository() {
    return {
        apiCredentials: initMemoryApiCredentialRepository({
            set: true,
            value: { apiNonce: markApiNonce("api-nonce"), apiRoles: markApiRoles(["role"]) },
        }),
        menuExpands: initOutlineMenuExpandRepository({
            menuExpand: initMemoryTypedStorage({ set: false }),
        }),
    }
}

function standardSimulator(): DocumentRemoteAccess {
    return {
        loadMenuBadge: initLoadOutlineMenuBadgeSimulateRemoteAccess(() => ({ success: true, value: {} }), {
            wait_millisecond: 0,
        }),
    }
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}