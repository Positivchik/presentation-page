import http from 'http';
import { Express } from 'express';
import { WebSocket, WebSocketServer } from 'ws';
import {
  store,
  ChannelsSlice,
  getUsersSelector,
  getChannelsSelector,
} from '@node/store';
import crypto from 'crypto';
import { WEBSOCKER_PORT } from '@node/constants';
import {
  TCloseResponse,
  TConnectRequest,
  TCreateRequest,
  TCreateResponse,
  TUpdateRequest,
  TUpdateResponse,
  WSEvents,
} from '@node/types/WS';

const WebSocketMap: Record<string, WebSocket> = {};
const usersPositions: Record<string, [number, number]> = {};

export const initWebSocket = (app: Express) => {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  const handleWSConnection = (ws: WebSocket) => {
    const userId = crypto.randomUUID();
    WebSocketMap[userId] = ws;

    ws.on('message', (message) => {
      const parsedData = JSON.parse(message.toString());

      switch (parsedData.type) {
        case 'update': {
          const typedData: TUpdateRequest = parsedData;
          const { currentUser, otherUsers } = getUsersSelector(userId);
          otherUsers.forEach(({ userId }) => {
            const ws = WebSocketMap[userId];
            const data: TUpdateResponse = {
              type: WSEvents.UPDATE,
              payload: {
                userId: currentUser.userId,
                position: typedData.payload,
              },
            };
            ws?.send(JSON.stringify(data));
          });
          break;
        }
        case 'create': {
          const typedData: TCreateRequest = parsedData;
          usersPositions[userId] = typedData.payload.position;

          store.dispatch(
            ChannelsSlice.actions.createChannel({
              userId,
            })
          );

          const data: TCreateResponse = {
            type: WSEvents.CREATE,
            payload: userId,
          };
          ws.send(JSON.stringify(data));

          console.log('Channel created');
          break;
        }
        case 'connect': {
          const typedData: TConnectRequest = parsedData;
          const { channelId } = typedData.payload;
          const { otherUsers } = getUsersSelector(userId);
          const channels = getChannelsSelector();
          if (otherUsers.length >= 2 || !channels[channelId]) {
            ws.close();
            return;
          }

          store.dispatch(
            ChannelsSlice.actions.connectToChannel({
              channelId,
              userId,
            })
          );
          ws.send(JSON.stringify({ type: 'connect', payload: userId }));

          const { otherUsers: otherUsersUpdated } = getUsersSelector(userId);
          otherUsersUpdated.forEach(({ userId: anotherUserId }) => {
            const ws = WebSocketMap[userId];
            const position = usersPositions[anotherUserId];

            if (position) {
              const data: TUpdateResponse = {
                type: WSEvents.UPDATE,
                payload: {
                  userId,
                  position,
                },
              };
              ws?.send(JSON.stringify(data));
            }
          });

          console.log('Client connected');
          break;
        }
        default:
          return;
      }
    });

    ws.on('close', () => {
      const { currentUser, otherUsers } = getUsersSelector(userId);
      otherUsers.forEach(({ userId }) => {
        const data: TCloseResponse = {
          type: WSEvents.CLOSE,
          payload: currentUser.userId,
        };
        const ws = WebSocketMap[userId];
        ws?.send(JSON.stringify(data));
      });

      store.dispatch(ChannelsSlice.actions.disconnectUser({ userId }));
      delete WebSocketMap[userId];

      console.log('Client disconnected');
    });
  };

  wss.on('connection', handleWSConnection);

  server.listen(WEBSOCKER_PORT, () => {
    console.log(`Server is listening on http://localhost:${WEBSOCKER_PORT}`);
  });
};
