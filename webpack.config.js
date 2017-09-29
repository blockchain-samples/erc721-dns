const { resolve } = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-eval-sorce-map',
    entry: [
        'webpack-hot-middleware/client',
        'babel-polyfill',
        'react-hot-loader/patch',
        './server/index'
    ],
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new UglifyJSPlugin,
//        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: [
                    resolve(__dirname, 'server')
                ],
                loaders: ['babel-loader']
            },{
                test: /(\.css|\.scss)$/,
                include: [
                    resolve(__dirname, 'server'),
                    resolve(__dirname, 'node_modules')
                ],
                loaders: ["style-loader", "css-loader"]
            }
        ]
    }
}
