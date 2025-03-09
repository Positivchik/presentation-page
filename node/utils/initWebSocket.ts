import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import {
  store,
  ChannelsSlice,
  getUsersSelector,
  getChannelsSelector,
} from '@node/store';
import {
  TCloseResponse,
  TConnectRequest,
  TCreateRequest,
  TCreateResponse,
  TUpdateRequest,
  TUpdateResponse,
  WSEvents,
} from '@node/types/WS';
import { getRandomNumber } from './getRandomNumber';
import { callRecursive } from './callRecursive';
import { DefaultEventsMap, Server, Socket } from 'socket.io';

// const WebSocketMap: Record<string, WebSocket> = {};
const WebSocketMap: Record<
  string,
  Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
> = {};
const usersPositions: Record<string, [number, number]> = {};

export const initWebSocket = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  const io = new Server(server, {
    transports: ['polling'], // Отключаем WebSocket
    path: '/poll',
  });

  io.on('connection', (ws) => {
    console.log('Клиент подключился к WebSocket');
    const userId = callRecursive(
      () => String(getRandomNumber(3)),
      (v) => !WebSocketMap[v]
    );
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
            ws.disconnect();
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

    ws.on('disconnect', () => {
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
  });

  // const wss = new WebSocketServer({ server, path: '/ws' });

  // const handleWSConnection = (ws: WebSocket) => {
  //   console.log('Клиент подключился к WebSocket');
  //   const userId = callRecursive(
  //     () => String(getRandomNumber(3)),
  //     (v) => !WebSocketMap[v]
  //   );
  //   WebSocketMap[userId] = ws;

  //   ws.on('message', (message) => {
  //     const parsedData = JSON.parse(message.toString());

  //     switch (parsedData.type) {
  //       case 'update': {
  //         const typedData: TUpdateRequest = parsedData;
  //         const { currentUser, otherUsers } = getUsersSelector(userId);
  //         otherUsers.forEach(({ userId }) => {
  //           const ws = WebSocketMap[userId];
  //           const data: TUpdateResponse = {
  //             type: WSEvents.UPDATE,
  //             payload: {
  //               userId: currentUser.userId,
  //               position: typedData.payload,
  //             },
  //           };
  //           ws?.send(JSON.stringify(data));
  //         });
  //         break;
  //       }
  //       case 'create': {
  //         const typedData: TCreateRequest = parsedData;
  //         usersPositions[userId] = typedData.payload.position;

  //         store.dispatch(
  //           ChannelsSlice.actions.createChannel({
  //             userId,
  //           })
  //         );

  //         const data: TCreateResponse = {
  //           type: WSEvents.CREATE,
  //           payload: userId,
  //         };
  //         ws.send(JSON.stringify(data));

  //         console.log('Channel created');
  //         break;
  //       }
  //       case 'connect': {
  //         const typedData: TConnectRequest = parsedData;
  //         const { channelId } = typedData.payload;
  //         const { otherUsers } = getUsersSelector(userId);
  //         const channels = getChannelsSelector();
  //         if (otherUsers.length >= 2 || !channels[channelId]) {
  //           ws.close();
  //           return;
  //         }

  //         store.dispatch(
  //           ChannelsSlice.actions.connectToChannel({
  //             channelId,
  //             userId,
  //           })
  //         );
  //         ws.send(JSON.stringify({ type: 'connect', payload: userId }));

  //         const { otherUsers: otherUsersUpdated } = getUsersSelector(userId);
  //         otherUsersUpdated.forEach(({ userId: anotherUserId }) => {
  //           const ws = WebSocketMap[userId];
  //           const position = usersPositions[anotherUserId];

  //           if (position) {
  //             const data: TUpdateResponse = {
  //               type: WSEvents.UPDATE,
  //               payload: {
  //                 userId,
  //                 position,
  //               },
  //             };
  //             ws?.send(JSON.stringify(data));
  //           }
  //         });

  //         console.log('Client connected');
  //         break;
  //       }
  //       default:
  //         return;
  //     }
  //   });

  //   ws.on('close', () => {
  //     const { currentUser, otherUsers } = getUsersSelector(userId);
  //     otherUsers.forEach(({ userId }) => {
  //       const data: TCloseResponse = {
  //         type: WSEvents.CLOSE,
  //         payload: currentUser.userId,
  //       };
  //       const ws = WebSocketMap[userId];
  //       ws?.send(JSON.stringify(data));
  //     });

  //     store.dispatch(ChannelsSlice.actions.disconnectUser({ userId }));
  //     delete WebSocketMap[userId];

  //     console.log('Client disconnected');
  //   });
  // };

  // wss.on('connection', handleWSConnection);
};
