require('dotenv').config();
const node_env = process.env.NODE_ENV;
const port = process.env.PORT;

const express = require('express');
const app = express();

console.log('node_env: ', node_env);
if (node_env !== 'production') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
  const config = require('../webpack.dev.js');
  const compiler = webpack(config);
  // Tell express to use the webpack-dev-middleware and use the webpack.config.js
  // configuration file as a base.
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config[0].output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler.compilers.find(compiler => compiler.name === 'client')));
  app.use(webpackHotServerMiddleware(compiler));
}
else {
  let app_dir = process.env.APP_DIR;
  let path = __dirname + app_dir;
  app.use(express.static(path));
}

app.get('/wiki/*', (req, res) => {
  console.log('getting wiki');
  for (let p in req) {
    if (req.hasOwnProperty(p)) {
      console.log('p', p);
      console.log('req.p', req.p);
    }
  }
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '\n');
});
