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
  addPoints: React.Dispatch<React.SetStateAction<TUpdatePayload[]>>;
  channelId: string;
  onClose: () => void;
}

export const WebsocketConnect: FC<WebsocketConnectProps> = ({
  type,
  name,
  position,
  addPoints,
  channelId,
  onClose,
}) => {
  const [isReady, setIsReady] = useState<boolean>(false);

  const { sendMessage, close } = useWebSocket(
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
        const channelUrl = `${window.location.origin}?${CHANNEL_URL_PARAM}=${parsedData.payload}`;
        alert(channelUrl);

        console.log(channelUrl);
      }

      if (parsedData.type === 'close') {
        // Если создатель канала отключается, то прерываем соединение
        if (parsedData.payload === channelId) {
          close();
          onClose();
          addPoints([]);
        } else {
          addPoints((v) =>
            v.filter(({ userId }) => {
              return parsedData.payload !== userId;
            })
          );
        }
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
