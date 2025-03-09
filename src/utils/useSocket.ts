import { POLL_URL } from '@node/constants';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = (
  url: string,
  onOpen: (ws: SocketIOClient.Socket) => void,
  onMessage: (message: string) => void
) => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const ioSocket = io(url, {
      transports: ['polling'], // Принудительно включаем long polling
      path: POLL_URL,
    });

    ioSocket.on('connect', () => {
      console.log('Клиент подключен');
      onOpen(ioSocket);
    });

    ioSocket.on('message', onMessage);
    ioSocket.on('disconnect', () => console.log('Disconnected'));
    ioSocket.on('connect_error', () => console.log('Error'));

    setSocket(ioSocket);

    return () => {
      ioSocket.disconnect();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (socket && socket.connected) {
      socket.emit('message', message);
    }
  };

  return { sendMessage, close: () => socket?.disconnect() };
};
