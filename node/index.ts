import express from 'express';
import fs from 'fs';
import { WebSocketServer } from 'ws';
import http from 'http';

const app = express();

{
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
      console.log(`Received: ${message}`);
      ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
  server.listen(8080, () => {
    console.log('Server is listening on http://localhost:8080');
});
}

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
