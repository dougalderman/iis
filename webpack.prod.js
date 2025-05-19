const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const helpers = require('./config/helpers');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const RemovePlugin = require('remove-files-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const linkerPlugin = require('@angular/compiler-cli/linker/babel');
const { AngularWebpackPlugin } = require('@ngtools/webpack');


module.exports = merge(common, {
  devtool: 'source-map',
  mode: 'production',
  entry: {
    'main': helpers.root('./public/src', 'main.ts')
  },
  output: {
    path: helpers.root('./dist/public'),
    publicPath: '/',
    filename: '[name].[hash].js',
  },
  plugins: [
    new RemovePlugin({
      before: {
          include: [
              helpers.root('./dist/public')
          ]
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        helpers.root('./public/src', 'robots.txt')
      ]
    }),
    new HtmlWebpackPlugin({
      template: helpers.root('./public/src', 'index.html'),
      favicon: helpers.root('./public/src', 'favicon.ico')
    }),
    new AngularWebpackPlugin({
      sourceMap: true,
      tsconfig: helpers.root('./public/src', 'tsconfig.app.json'),
      skipCodeGeneration: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: '@ngtools/webpack',
        exclude: /node_modules/
      },
      {
        test: /\.[cm]?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            compact: false,
            plugins: [linkerPlugin],
          },
        }
      }    
    ]
  }
});
