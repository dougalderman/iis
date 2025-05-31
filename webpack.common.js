const helpers = require('./config/helpers');

module.exports = {
  name: 'client',
  target: 'web',
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
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
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash][ext]',
        },
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

