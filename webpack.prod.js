const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const helpers = require('./config/helpers');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const { AngularCompilerPlugin } = require('@ngtools/webpack');

module.exports = merge(common, {
  devtool: 'source-map',
  mode: 'production',
  output: {
    path: helpers.root('dist/public'),
    publicPath: '/',
    filename: '[name].[hash].js',
  },
  optimization: {
    minimizer: [new UglifyJSPlugin()]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: helpers.root('./src', 'index.prod.html'),
      favicon: helpers.root('./src', 'favicon.ico')
    }),
    new AngularCompilerPlugin({
      entryModule: helpers.root('./src', 'app/app.module#AppModule'),
      sourceMap: false,
      tsConfigPath: helpers.root('./', 'tsconfig.json'),
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
      }
    ]
  }
});
