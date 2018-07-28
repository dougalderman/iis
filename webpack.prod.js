const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const helpers = require('./config/helpers');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = merge(common, {
  devtool: 'source-map',
  mode: 'production',
  output: {
    path: helpers.root('dist/public'),
    publicPath: '/',
    filename: '[name].[hash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/src/index.prod.html',
      favicon: 'public/src/favicon.ico'
    }),
    new UglifyJSPlugin({
      sourceMap: true,
      uglifyOptions: {
        keep_fnames: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    })
  ]
});
