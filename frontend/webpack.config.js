const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    target: "web",
    entry: "./src/game.js",
    output: {
        filename: "bundle.js",
    },
    plugins: [
        new NodePolyfillPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/game.html"
        })
    ],
    resolve: {
        fallback: {
            "fs": false
        },
    },
    devServer: {
        port: 8080,
    },
    mode: "development"
};