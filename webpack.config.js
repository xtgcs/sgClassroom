/**
 * Created by Action on 17/4/24.
 */
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry:{
        app: './app/js/app.js',
        vendors:["./app/js/thirdparty/angular.js","./app/js/thirdparty/angular-ui-router.min.js","./app/js/thirdparty/angular-resource.js","./app/js/thirdparty/angular-sanitize.js","./app/js/thirdparty/rem.js","./app/js/thirdparty/angular-file-upload.js"],
    },
    output: {
        filename: 'js/[name].[chunkhash].js',
        path: __dirname + '/build'
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                loader: 'css-loader',
                loader: ExtractTextPlugin.extract({
                    loader: 'css-loader'
               })
            },
            {
                test: /\.(gif|jpg|png)$/,
                loader: 'url-loader?limit=8192&name=image/[hash:8].[name].[ext]'
            },
            {
                test: /\.(htm|html)$/i,
                loader: 'html-withimg-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
             new ExtractTextPlugin('styles.css'),
             new HtmlWebpackPlugin({
                template: __dirname + "/app/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数
             }),
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendors', 'manifest'] // 指定公共 bundle 的名字。
            }),
             new CopyWebpackPlugin([{
                from: __dirname + '/app/image',
                 to:__dirname +'/build/image'
             }]),
            new CopyWebpackPlugin([{
                from: __dirname + '/app/partials',
                to:__dirname +'/build/partials'
            }]),
             new CleanWebpackPlugin(['build'])
    ],

    devServer: {
        contentBase: "./build",//本地服务器所加载的页面所在的目录
        colors: true,//终端中输出结果为彩色
        historyApiFallback: true,//不跳转
        inline: true//实时刷新
    }
}