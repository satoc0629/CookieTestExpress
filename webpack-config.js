const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require("path")
const outputPath = path.resolve(__dirname, 'dist');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require("webpack");

module.exports = {
    devtool: 'source-map',
    entry: "./web/index.tsx",
    mode: "development",
    output: {
        filename: "./[name]-[hash].bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.Webpack.js', '.web.js', '.ts', '.js', '.jsx', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.html$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "html-loader"
                }
            }
        ]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(), new HtmlWebpackPlugin({
            template: "./web/index.html"
        })],
    devServer: {
        contentBase: outputPath,
        port: 8082,
        proxy: {
            '/': 'http://localhost:3000'
        }
    }
}