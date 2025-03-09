import express from 'express';
import fs from 'fs';
import { APP_PORT } from '@node/constants';
import { initSocketIO } from './utils/initSocketIO';
import bodyParser from 'body-parser';
import http from 'http';

const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} Request from: ${req.hostname}`);
  next();
});

app.use(express.static('./dist/browser'));
app.use(bodyParser.json());

initSocketIO(server);

app.get('/', (req, res) => {
  const file = fs.readFileSync('./dist/browser/index.html', 'utf-8');
  res.send(file);
});

server.listen(APP_PORT, () => {
  console.log(`🚀 Server running at:`);
  console.log(`   - Local:   http://localhost:${APP_PORT}`);
});
