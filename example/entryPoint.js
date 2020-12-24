/* eslint-disable */

module.exports = {
    findPublicEntries,
    findSecureEntries,
    toSecureEntryName,
    toSecureEntryPath,
}

function findPublicEntries() {
    return ["update/moveToNextVersion", "auth/login"]
}

function findSecureEntries() {
    const fs = require("fs")
    const path = require("path")

    const root = path.join(__dirname, "./public/dist")
    return gatherFiles(root).map((file) => file.replace(root, ""))

    function gatherFiles(dir) {
        const files = []
        fs.readdirSync(dir, { withFileTypes: true }).forEach((file) => {
            if (file.isDirectory()) {
                if (isGatherDirectory(file.name)) {
                    gatherFiles(path.join(dir, file.name)).forEach((file) => {
                        files.push(file)
                    })
                }
            }
            if (file.isFile()) {
                if (file.name.endsWith(".html")) {
                    files.push(path.join(dir, file.name))
                }
            }
        })
        return files

        function isGatherDirectory(name) {
            const target = path.join(dir, name).replace(root, "")
            switch (target) {
                case "/coverage":
                case "/css":
                case "/fonts":
                case "/vs-ext":
                    return false

                default:
                    return true
            }
        }
    }
}

function toSecureEntryName(file) {
    return file.replace("/", "").replace(/\.html$/, "")
}
function toSecureEntryPath(file) {
    if (file.startsWith("/docs/")) {
        return "/docs"
    }
    return file.replace(/\.html$/, "")
}