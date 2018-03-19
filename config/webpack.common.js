const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
var helpers = require('./helpers');

module.exports = {
  entry: {
    'polyfills': './public/src/polyfills.ts',
    'vendor': './public/src/vendor.ts',
    'app': './public/src/main.ts'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
        helpers.root('./public/src'), // location of your src
      {} // a map of your routes
    ),
  ],
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  module: {
    rules: [
      {
        // Image files
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.tsx?$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: helpers.root('src', 'tsconfig.json') }
          } , 'angular2-template-loader'
        ],
        exclude: /node_modules/
      }
    ]
  }
};
