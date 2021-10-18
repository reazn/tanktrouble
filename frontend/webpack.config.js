const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "production",
    target: "web",
    entry: "./src/game.js",
    output: {
        filename: "client_bundle.js",
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