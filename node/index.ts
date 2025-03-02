import express from 'express';
import fs from 'fs';
import { APP_PORT } from '@node/constants';
import { initWebSocket } from './utils/initWebSocket';

const app = express();
initWebSocket(app);
app.use(express.static('./dist/browser'));

console.log('start');

app.get('/', (req, res) => {
  console.log('request', Date.now());
  const file = fs.readFileSync('./dist/browser/index.html', 'utf-8');
  res.send(file);
});

app.listen(APP_PORT, () => {
  console.log(`Example app listening on port ${APP_PORT}`);
});
