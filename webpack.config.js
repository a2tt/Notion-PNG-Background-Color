const webpack = require("webpack");
const path = require("path");
const fileSystem = require("fs");
const env = require("./utils/env");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')

// load the secrets
var alias = {};

var secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));

var imageExtensions = ["jpg", "jpeg", "png", "gif", "svg"];

if (fileSystem.existsSync(secretsPath)) {
    alias["secrets"] = secretsPath;
}

var options = {
    mode: process.env.NODE_ENV || "development",
    entry: {
        popup: path.join(__dirname, "src", "js", "popup.js"),
        inserted: path.join(__dirname, "src", "js", "inserted.js"),
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
                exclude: /node_modules/
            },
            {
                test: new RegExp('.(' + imageExtensions.join('|') + ')$'),
                loader: "file-loader",
                options: {
                    name: '[name].[ext]',
                    outputPath: 'img',
                    publicPath: '../img',
                },
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: "html-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        alias: alias
    },
    plugins: [
        new MiniCssExtractPlugin({}),
        // clean the build folder
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false
        }),
        // expose and write the allowed env vars on the compiled bundle
        new webpack.EnvironmentPlugin(["NODE_ENV"]),
        new CopyWebpackPlugin([{
            from: "src/manifest.json",
            transform: function (content, path) {
                // generates the manifest file using the package.json informations
                return Buffer.from(JSON.stringify({
                    ...JSON.parse(content.toString()),
                    description: process.env.npm_package_description,
                    version: process.env.npm_package_version
                }))
            }
        }, {
            from: "src/img",
            to: "img"
        }
        ]),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "html", "popup.html"),
            filename: "html/popup.html",
            chunks: ["popup"]
        }),
        new WriteFilePlugin()
    ]
};

if (env.NODE_ENV === "development") {
    options.devtool = "cheap-source-map";
}

module.exports = options;
