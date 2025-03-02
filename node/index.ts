import express from 'express';
import fs from 'fs';
import { APP_PORT } from '@node/constants';
import { initWebSocket } from './utils/initWebSocket';
import bodyParser from 'body-parser';

const app = express();
app.use(express.static('./dist/browser'));
app.use(bodyParser.json());

initWebSocket(app);

app.get('/', (req, res) => {
  const file = fs.readFileSync('./dist/browser/index.html', 'utf-8');
  res.send(file);
});

app.listen(APP_PORT, () => {
  console.log(`Example app listening on port ${APP_PORT}`);
});
