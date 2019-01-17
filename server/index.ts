import * as dotenv from 'dotenv';
import * as express from 'express';
import * as expressSession from 'express-session';
import * as bodyParser from 'body-parser';
import { EndpointsController } from './controllers/endpointsController';
import { TimedTasksController } from './controllers/timedTasksController';

dotenv.config();
let node_env = process.env.NODE_ENV;
let port = process.env.PORT;
let app_dir = process.env.APP_DIR;
let path = __dirname + app_dir;

console.log('node_env: ', node_env);

const app = express();
app.use(bodyParser.json());
app.use(express.static(path));
app.use(expressSession({
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false
}));

// Execute timed tasks
new TimedTasksController();

// Endpoints
new EndpointsController(app);

app.get('/wiki/*', (req, res) => {
  if (req.originalUrl) {
    res.redirect('https://en.wikipedia.org' + req.originalUrl);
  }
});

// 404 catch
app.all('*', (req: any, res: any) => {
  res.status(200).sendFile('index.html', {root: path});
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '\n');
});
