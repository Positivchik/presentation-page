import express from 'express';
import fs from 'fs';

const app = express();
const port = 3000;

app.use(express.static('./dist/browser'));
console.log('start');

app.get('/', (req, res) => {
  console.log('request', Date.now());
  const file = fs.readFileSync('./dist/browser/index.html', 'utf-8');
  res.send(file);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
