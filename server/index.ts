import * as dotenv from 'dotenv';
import * as express from 'express';
import * as expressSession from 'express-session';
import * as bodyParser from 'body-parser';
import { Pool } from 'pg';

import { EndpointsController } from './controllers/endpointsController';
import { TimedTasksController } from './controllers/timedTasksController';

dotenv.config();
let port: string = process.env.PORT;
let app_dir: string = process.env.APP_DIR;
let path: string = __dirname + app_dir;
console.log('path:', path);

const app: any = express();
app.use(bodyParser.json());
app.use(express.static(path));
app.use(expressSession({
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false
}));

// Open DB pool connection
const pgSqlPool = new Pool();

// Execute timed tasks
new TimedTasksController(pgSqlPool);

// Endpoints
new EndpointsController(app, pgSqlPool);

app.get('/wiki/*splat', (req, res) => {
  if (req.originalUrl) {
    res.redirect('https://en.wikipedia.org' + req.originalUrl);
  }
});

// 404 catch
app.all('/{*splat}', (req: any, res: any) => {
  res.status(200).sendFile('index.html', {root: path});
});

app.listen(port, function () {
  console.log('App listening on port ' + port + '\n');
});
