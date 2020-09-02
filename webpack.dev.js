const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const helpers = require('./config/helpers');
const { AngularCompilerPlugin } = require('@ngtools/webpack');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  output: {
    path: helpers.root('./dist/public'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new AngularCompilerPlugin({
      entryModule: helpers.root('./public/src', 'app/app.module#AppModule'),
      sourceMap: true,
      tsConfigPath: helpers.root('./', 'tsconfig.json'),
      skipCodeGeneration: true
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
