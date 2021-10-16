const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    target: "web",
    entry: "./src/game.js",
    output: {
        filename: "bundle.js",
    },
    module: {
        rules: [{
            test: /\.s[ac]ss$/i,
            use: [
                "style-loader",
                "css-loader",
                "sass-loader"
            ]
        }, {
            test: /\.m?js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
        }]
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
    }
};