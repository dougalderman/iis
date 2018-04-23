const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const helpers = require('./config/helpers');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = merge({}, {
  entry: {
    'server': './server/index.js'
  },
  devtool: 'source-map',
  mode: 'production',
  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
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
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    }),
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        minimize: false // workaround for ng2
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.(s*)css$/, // Test for CSS or Sass
        exclude: helpers.root('./public/src', 'app'), // exclude component-scoped styles
        use:
          [ MiniCssExtractPlugin.loader,
        'css-loader', 'sass-loader']
      },
      {
        test: /\.(s*)css$/, // Test for CSS or Sass
        include: helpers.root('./public/src', 'app'), // include component-scoped styles
        use: ['raw-loader', 'sass-loader']
      },
      {
        test: /\.js$/,
        exclude: helpers.root('./node_modules'),
        include:  helpers.root('./server'), // Test for server js
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
});
