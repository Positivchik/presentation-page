import { useEffect, useState } from 'react';

export const useWebSocket = (
  url: string,
  onOpen: (ws: WebSocket) => void,
  onMessage: (event: MessageEvent<unknown>) => void
) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      onOpen(ws);
    };
    ws.onmessage = onMessage;
    ws.onclose = () => console.log('Disconnected from WebSocket');
    ws.onerror = (error) => console.error('WebSocket Error:', error);

    setSocket(ws);

    return () => ws.close();
  }, [url]);

  const sendMessage = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  };

  return { sendMessage };
};
