import { useEffect, useState } from 'react';

export const useWebSocket = (url: string, onOpen: (ws: WebSocket) => void) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket(url);
    // @ts-expect-error any
    window.myWS = ws;

    ws.onopen = () => {
      onOpen(ws);
      //   ws.send(JSON);
    };
    ws.onmessage = (event) => {
      console.log('Received:', event.data);
      setMessages((prev) => [...prev, event.data]);
    };
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

  return { messages, sendMessage };
};
