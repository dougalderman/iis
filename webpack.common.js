const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const helpers = require('./config/helpers');

module.exports = {
  name: 'client',
  target: 'web',
  entry: {
    'polyfills': helpers.root('./public/src', 'polyfills.ts'),
    'app': helpers.root('./public/src', 'main.ts')
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [helpers.root('./dist/public')]
    }),
    new HtmlWebpackPlugin({
      template: helpers.root('./public/src', 'index.html'),
      favicon: helpers.root('./public/src', 'favicon.ico')
    }),
    new CopyWebpackPlugin({
      patterns: [
        helpers.root('./public/src', 'robots.txt')
      ]
    }),
    new webpack.NoEmitOnErrorsPlugin()
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
        test: /\.(s*)css$/, // Test for CSS or Sass
        exclude: helpers.root('./public/src', 'app'), // exclude component-scoped styles
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(s*)css$/, // Test for CSS or Sass
        include: helpers.root('./public/src', 'app'), // include component-scoped styles
        use: ['raw-loader', 'sass-loader']
      }
    ]
  }
};

