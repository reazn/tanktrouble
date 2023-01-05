const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: "production",
    target: "node",
    entry: "./src/server.js",
    output: {
        filename: "server_bundle.js"
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
        }]
    },
    externals: [nodeExternals()],
    plugins: [
        new NodePolyfillPlugin()
    ],
    devServer: {
        port: 3000,
    },
}