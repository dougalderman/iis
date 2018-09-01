import * as dotenv from 'dotenv';
import * as express from 'express';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import * as bodyParser from 'body-parser';
import { Pool } from 'pg';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';

import * as config from '../webpack.dev.js';
import { EndpointsController } from './controllers/endpointsController';

let node_env, port;

dotenv.config();
node_env = process.env.NODE_ENV,
port = process.env.PORT;

console.log('node_env: ', node_env);

const app = express();
app.use(bodyParser.json());

if (node_env !== 'production') {
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

// Endpoints
let endpoints = new EndpointsController(app);

app.get('/wiki/*', (req, res) => {
  if (req.originalUrl) {
    res.redirect('https://en.wikipedia.org' + req.originalUrl);
  }
});

// 404 catch
app.all('*', (req: any, res: any) => {
  // onsole.log(`[TRACE] Server 404 request: ${req.originalUrl}`);
  let app_dir = process.env.APP_DIR;
  let path = __dirname + app_dir;
  // console.log('__dirname: ', __dirname)
  // console.log('path: ', path)
  // console.log('config.output.publicPath: ', config.output.publicPath)
  res.status(200).sendFile('index.html', {root: config.output.publicPath});
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '\n');
});
