import { useWebSocket } from '@utils/useWebSocket';
import { FC, useEffect, useState } from 'react';
import { WEBSOCKER_PORT } from '@node/constants';
import { CHANNEL_URL_PARAM } from '@constants/index';
import {
  TConnectRequest,
  TPosition,
  TUpdatePayload,
  WSEvents,
} from '@node/types/WS';

export interface WebsocketConnectProps {
  type: 'connect' | 'create';
  name: string;
  position: TPosition;
  addPoints: (data: TUpdatePayload[]) => void;
  channelId: string;
}

export const WebsocketConnect: FC<WebsocketConnectProps> = ({
  type,
  name,
  position,
  addPoints,
  channelId,
}) => {
  const [isReady, setIsReady] = useState<boolean>(false);

  const { sendMessage } = useWebSocket(
    `ws://localhost:${WEBSOCKER_PORT}`,
    (ws) => {
      if (type === 'connect') {
        const data: TConnectRequest = {
          type: WSEvents.CONNECT,
          payload: {
            name,
            channelId,
          },
        };

        ws.send(JSON.stringify(data));
      } else {
        ws.send(
          JSON.stringify({
            type: WSEvents.CREATE,
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
        addPoints([parsedData.payload]);
      }

      if (parsedData.type === 'create') {
        console.log(
          `${window.location.origin}?${CHANNEL_URL_PARAM}=${parsedData.payload}`
        );
      }
    }
  );

  useEffect(() => {
    if (isReady) {
      sendMessage(JSON.stringify({ type: WSEvents.UPDATE, payload: position }));
    }
  }, [isReady, position]);

  return null;
};
