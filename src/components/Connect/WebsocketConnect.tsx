import { useWebSocket } from '@utils/useWebSocket';
import { FC, useEffect, useState } from 'react';
import { getUrlParam } from '@utils/getUrlParam';

interface WebsocketConnectProps {
  type: 'connect' | 'create';
  name: string;
  position: [number, number];
  addMapObject: (any: any[]) => void;
}

export const WebsocketConnect: FC<WebsocketConnectProps> = ({
  type,
  name,
  position,
  addMapObject,
}) => {
  const [isReady, setIsReady] = useState<boolean>(false);

  const { sendMessage } = useWebSocket(
    `ws://localhost:8080`,
    (ws) => {
      if (type === 'connect') {
        const channelId = getUrlParam('channelId');

        ws.send(
          JSON.stringify({
            type: 'connect',
            payload: {
              name,
              channelId,
            },
          })
        );
      } else {
        ws.send(
          JSON.stringify({
            type: 'create',
            payload: {
              name,
              position,
            },
          })
        );
      }

      setIsReady(true);
    },
    (e) => {
      const parsedData = JSON.parse(e.data as string);

      if (parsedData.type === 'update') {
        const { userId, name, position } = parsedData.payload;

        addMapObject([
          {
            id: userId,
            name,
            position,
          },
        ]);
        console.log('update', parsedData.payload);
      }

      if (parsedData.type === 'create') {
        console.log(
          `${window.location.origin}?channelId=${parsedData.payload}`
        );
      }
    }
  );

  useEffect(() => {
    if (isReady) {
      sendMessage(JSON.stringify({ type: 'update', payload: position }));
    }
  }, [isReady, position]);

  return null;
};
