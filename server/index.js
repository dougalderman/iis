require('dotenv').config();

const node_env = process.env.NODE_ENV,
      port = process.env.PORT;

const express = require('express'),
      expressSession = require('express-session'),
      passport = require('passport'),
      passportLocal = require('passport-local'),
      bodyParser = require('body-parser'),
      { Client } = require('pg');

import { endpoints } from './controllers/endpoints';
import { addAdminUsers } from './controllers/adminUsers';

const app = express();
app.use(bodyParser.json());
    
console.log('node_env: ', node_env);
if (node_env !== 'production') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack.dev.js');
  const compiler = webpack(config);
  // Tell express to use the webpack-dev-middleware and use the webpack.config.js
  // configuration file as a base.
  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler));
}
else {
  let app_dir = process.env.APP_DIR;
  let path = __dirname + app_dir;
  app.use(express.static(path));
}

app.use(expressSession({
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

const pgSqlClient = new Client();
pgSqlClient.connect();

// add Admin users if they don't exist
addAdminUsers();

// Endpoints
endpoints();

app.get('/wiki/*', (req, res) => {
  if (req.originalUrl) {
    res.redirect('https://en.wikipedia.org' + req.originalUrl);
  }
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '\n');
});
