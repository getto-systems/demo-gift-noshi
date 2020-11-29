/* eslint-disable */
const path = require("path")
const WorkerPlugin = require("worker-plugin")

module.exports = {
    entry: () => {
        return [
            { type: "z_main", names: ["auth", "update"], suffix: "" },
            { type: "z_worker", names: ["auth"], suffix: ".worker" },
        ].reduce((acc, info) => {
            info.names.forEach((name) => {
                acc[toEntry(name)] = toPath(name)
            })
            return acc

            function toEntry(name) {
                return `${name}${info.suffix}`
            }
            function toPath(name) {
                return path.join(__dirname, `../lib/${info.type}/${name}/main.ts`)
            }
        }, {})
    },
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "[name].js",
        globalObject: "self",
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                resolve: {
                    extensions: [".ts"],
                },
            },
        ],
    },
    plugins: [new WorkerPlugin()],
    watchOptions: {
        ignored: /node_modules/,
    },
    devServer: {
        contentBase: path.join(__dirname, ".."),
        publicPath: "/dist/",

        host: "0.0.0.0",
        port: process.env.PUBLIC_APP_PORT,

        hot: true,
        sockPort: "443",

        disableHostCheck: true,
    },
}
