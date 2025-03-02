import express from 'express';
import fs from 'fs';
import { WebSocketServer } from 'ws';
import http from 'http';
import { WEBSOCKER_PORT, APP_PORT } from '@node/constants';
import { store, ChannelsSlice } from './store';
import crypto from 'crypto';

const app = express();

{
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    const userId = crypto.randomUUID();

    ws.on('message', (message: string) => {
      const parsedData = JSON.parse(message);

      switch (parsedData.type) {
        case 'update': {
          const { channels } = store.getState().channels;
          const [, users] = Object.entries(channels).find(([, users]) =>
            users.some(({ userId: id }) => id === userId)
          )!;
          const sendUsers = users.filter(({ userId: id }) => id !== userId);
          sendUsers.forEach(({ ws }) =>
            ws.send(
              JSON.stringify({
                type: 'update',
                payload: {
                  userId,
                  payload: parsedData.payload,
                },
              })
            )
          );
          break;
        }
        case 'create': {
          store.dispatch(
            ChannelsSlice.actions.createChannel({
              userId,
              name: parsedData.payload,
              ws,
            })
          );
          console.log('Channel created');
          break;
        }
        case 'connect': {
          const { name, channelId } = parsedData;
          store.dispatch(
            ChannelsSlice.actions.connectToChannel({
              channelId,
              userId,
              name,
              ws,
            })
          );
          console.log('Client connected');
          break;
        }
        default:
          return null;
      }

      ws.send(`Server received: ${message}`);
    });

    ws.on('close', () => {
      store.dispatch(ChannelsSlice.actions.disconnectChannel({ userId }));
      console.log('Client disconnected');
    });
  });
  server.listen(WEBSOCKER_PORT, () => {
    console.log(`Server is listening on http://localhost:${WEBSOCKER_PORT}`);
  });
}

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
