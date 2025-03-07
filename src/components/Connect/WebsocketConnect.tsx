import { useWebSocket } from '@utils/useWebSocket';
import { FC, useEffect, useState } from 'react';
import { WEBSOCKER_PORT } from '@node/constants';
import { TConnectRequest, TPosition, WSEvents } from '@node/types/WS';
import { TAnotherPositionState } from '@containers/Map/Map';

export interface WebsocketConnectProps {
  type: 'connect' | 'create';
  position: TPosition;
  setAnotherPosition: React.Dispatch<
    React.SetStateAction<TAnotherPositionState>
  >;
  channelId?: string;
  onClose: () => void;
  onOpen: (status: WebsocketConnectProps['type'] | null) => void;
  onCreate: (channelId: string) => void;
}

export const WebsocketConnect: FC<WebsocketConnectProps> = ({
  type,
  position,
  setAnotherPosition,
  channelId,
  onClose,
  onOpen,
  onCreate,
}) => {
  const [isReady, setIsReady] = useState<boolean>(false);

  const { sendMessage, close } = useWebSocket(
    `wss://${location.hostname}:${WEBSOCKER_PORT}`,
    (ws) => {
      if (type === 'connect' && channelId) {
        const data: TConnectRequest = {
          type: WSEvents.CONNECT,
          payload: {
            channelId,
          },
        };

        ws.send(JSON.stringify(data));
      } else {
        ws.send(
          JSON.stringify({
            type: WSEvents.CREATE,
            payload: {
              position,
            },
          })
        );
      }

      setIsReady(true);
      onOpen(type);
    },
    (e) => {
      const parsedData = JSON.parse(e.data as string);

      if (parsedData.type === 'update') {
        setAnotherPosition(parsedData.payload);
      }

      if (parsedData.type === 'create') {
        onCreate(parsedData.payload);
        // const channelUrl = `${window.location.origin}?${CHANNEL_URL_PARAM}=${parsedData.payload}`;
        // alert(channelUrl);

        // console.log(channelUrl);
      }

      if (parsedData.type === 'close') {
        // Если создатель канала отключается, то прерываем соединение
        if (parsedData.payload === channelId) {
          close();
          onClose();
        }
        {
          onOpen(null);
        }
        setAnotherPosition(null);
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
