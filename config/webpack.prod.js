const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(common, {
  devtool: 'source-map',
  mode: 'production',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'IIS Production',
      template: 'public/src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new webpack.optimize.UglifyJSPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
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
        use:
          [ MiniCssExtractPlugin.loader,
        'css-loader', 'sass-loader']
      }
    ]
  }
});
