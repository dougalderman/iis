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
new EndpointsController(app, path, pgSqlPool);

app.listen(port, function () {
  console.log('App listening on port ' + port + '\n');
});
