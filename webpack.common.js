const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const helpers = require('./config/helpers');

module.exports = {
  name: 'client',
  target: 'web',
  entry: {
    'polyfills': './public/src/polyfills.ts',
    'app': './public/src/main.ts'
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new CleanWebpackPlugin(['./dist']),
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        // Image files
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.tsx?$/,
        use: [
          'ts-loader',
          'angular2-template-loader'
        ],
        exclude: /node_modules/
      }
    ]
  }
};

