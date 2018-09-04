const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const helpers = require('./config/helpers');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  mode: 'production',
  entry: {
    'server': './server/index.ts'
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  node: {
    __dirname: false
  },
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  output: {
    path: helpers.root('dist/server'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new CleanWebpackPlugin(['./dist/server']),
    new webpack.NoEmitOnErrorsPlugin(),
    new UglifyJSPlugin({
      sourceMap: true,
      uglifyOptions: {
        keep_fnames: true
      }
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'ts-loader'
        ],
        exclude: /node_modules/
      }
    ]
  }
}