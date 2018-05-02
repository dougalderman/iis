const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const helpers = require('./config/helpers');
const nodeExternals = require('webpack-node-externals');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

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
      cacheGroups: {
        server: {
          name: "server",
          test: "server",
          enforce: true
        }
      }
    }
  },
  output: {
    path: helpers.root('dist/server'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
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
