const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
var helpers = require('./config/helpers');

module.exports = {
  entry: {
    'polyfills': './public/src/polyfills.ts',
    'vendor': './public/src/vendor.ts',
    'app': './public/src/main.ts'
  },
  optimization: {
		splitChunks: {
			cacheGroups: {
				polyfills: {
					name: "polyfills",
					test: "polyfills",
					enforce: true
				},
				vendor: {
					name: "vendor",
					test: "vendor",
					enforce: true
        },
        app: {
					name: "app",
					test: "app",
					enforce: true
				}
			}
    }
  },
  plugins: [
    new CleanWebpackPlugin(['./dist']),
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
        helpers.root('./public/src'), // location of your src
      {} // a map of your routes
    )
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
