import { useSocket } from '@utils/useSocket';
import { FC, useEffect, useState } from 'react';
import { TConnectRequest, TPosition, WSEvents } from '@node/types/WS';
import { TAnotherPositionState } from '@containers/Map/Map';

export interface SocketIOConnectProps {
  type: 'connect' | 'create';
  position: TPosition;
  setAnotherPosition: React.Dispatch<
    React.SetStateAction<TAnotherPositionState>
  >;
  channelId?: string;
  onClose: () => void;
  onOpen: (status: SocketIOConnectProps['type'] | null) => void;
  onCreate: (channelId: string) => void;
}

export const SocketIOConnect: FC<SocketIOConnectProps> = ({
  type,
  position,
  setAnotherPosition,
  channelId,
  onClose,
  onOpen,
  onCreate,
}) => {
  const [isReady, setIsReady] = useState<boolean>(false);

  const { sendMessage, close } = useSocket(
    window.location.origin,
    (socket) => {
      if (type === 'connect' && channelId) {
        const data: TConnectRequest = {
          type: WSEvents.CONNECT,
          payload: {
            channelId,
          },
        };

        socket.emit('message', JSON.stringify(data));
      } else {
        socket.emit(
          'message',
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
    (message) => {
      console.log('message', message);
      const parsedData = JSON.parse(message);

      if (parsedData.type === 'update') {
        setAnotherPosition(parsedData.payload);
      }

      if (parsedData.type === 'create') {
        onCreate(parsedData.payload);
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
