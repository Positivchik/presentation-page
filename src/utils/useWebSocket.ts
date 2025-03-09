import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useWebSocket = (
  url: string,
  onOpen: (ws: SocketIOClient.Socket) => void,
  onMessage: (message: string) => void
) => {
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    // const ws = new WebSocket(url);
    const ioSocket = io(url, {
      transports: ['polling'], // Принудительно включаем long polling
      path: '/poll',
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
    // if (socket && socket.readyState === WebSocket.OPEN) {
    //   socket.send(message);
    // }
  };

  return { sendMessage, close: () => socket?.disconnect() };

  //   ws.onopen = () => {
  //     onOpen(ws);
  //   };
  //   ws.onmessage = onMessage;
  //   ws.onclose = () => console.log('Disconnected from WebSocket');
  //   ws.onerror = (error) => console.error('WebSocket Error:', error);

  //   setSocket(ws);

  //   return () => ws.close();
  // }, [url]);

  // const sendMessage = (message: string) => {
  //   if (socket && socket.readyState === WebSocket.OPEN) {
  //     socket.send(message);
  //   }
  // };

  // return { sendMessage, close: () => socket?.close() };
};
