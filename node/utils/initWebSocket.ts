import http from 'http';
import { Express } from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import { store, ChannelsSlice } from '@node/store';
import crypto from 'crypto';
import { WEBSOCKER_PORT } from '@node/constants';

const WebSocketMap: Record<string, WebSocket> = {};
const usersPositions: Record<string, [number, number]> = {};

export const initWebSocket = (app: Express) => {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    const userId = crypto.randomUUID();
    WebSocketMap[userId] = ws;

    ws.on('message', (message) => {
      const parsedData = JSON.parse(message.toString());
      console.log('message', parsedData);

      switch (parsedData.type) {
        case 'update': {
          const { channels } = store.getState().channels;
          const [, users] =
            Object.entries(channels || {}).find(([, users]) =>
              users?.some(({ userId: id }) => id === userId)
            ) || [];

          const sendUsers =
            users?.filter(({ userId: id }) => id !== userId) || [];
          sendUsers?.forEach(({ userId, name }) => {
            const ws = WebSocketMap[userId];
            ws?.send(
              JSON.stringify({
                type: 'update',
                payload: {
                  userId,
                  name,
                  position: parsedData.payload,
                },
              })
            );
          });
          break;
        }
        case 'create': {
          usersPositions[userId] = parsedData.payload.position;

          store.dispatch(
            ChannelsSlice.actions.createChannel({
              userId,
              name: parsedData.payload.name,
            })
          );
          ws.send(JSON.stringify({ type: 'create', payload: userId }));
          const { channels } = store.getState().channels;

          console.log('Channel created', channels);
          break;
        }
        case 'connect': {
          const { name, channelId } = parsedData.payload;
          store.dispatch(
            ChannelsSlice.actions.connectToChannel({
              channelId,
              userId,
              name,
            })
          );
          ws.send(JSON.stringify({ type: 'connect', payload: userId }));
          console.log('Client connected');

          const { channels } = store.getState().channels;
          const [, users] =
            Object.entries(channels || {}).find(([, users]) =>
              users?.some(({ userId: id }) => id === userId)
            ) || [];

          const sendUsers =
            users?.filter(({ userId: id }) => id !== userId) || [];

          sendUsers?.forEach(({ userId: anotherUserId, name }) => {
            const ws = WebSocketMap[userId];
            const position = usersPositions[anotherUserId];

            if (position) {
              ws?.send(
                JSON.stringify({
                  type: 'update',
                  payload: {
                    userId,
                    name,
                    position,
                  },
                })
              );
            }
          });

          break;
        }
        default:
          return null;
      }
    });

    ws.on('close', () => {
      const { channels } = store.getState().channels;
      const [, users] =
        Object.entries(channels || {}).find(([, users]) =>
          users?.some(({ userId: id }) => id === userId)
        ) || [];

      const sendUsers = users?.filter(({ userId: id }) => id !== userId);
      sendUsers?.forEach(({ userId }) => {
        const ws = WebSocketMap[userId];
        ws?.send(
          JSON.stringify({
            type: 'close',
            payload: userId,
          })
        );
      });

      store.dispatch(ChannelsSlice.actions.disconnectChannel({ userId }));
      delete WebSocketMap[userId];

      console.log('Client disconnected');
    });
  });
  server.listen(WEBSOCKER_PORT, () => {
    console.log(`Server is listening on http://localhost:${WEBSOCKER_PORT}`);
  });
};
