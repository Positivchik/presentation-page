import { FC, useEffect, useState } from 'react';
import { Modal } from 'antd';

const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket(url);
    // @ts-expect-error any
    window.myWS = ws;

    ws.onopen = () => console.log('Connected to WebSocket');
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

const WebsocketCreate: FC<unknown> = () => {
  const { messages, sendMessage } = useWebSocket('ws://localhost:8080');
  const [message, setMessage] = useState<string>('');

  return (
    <div>
      Created
      <input
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <button
        onClick={() => {
          sendMessage(message);
        }}
      >
        Отправить
      </button>
      <div>{messages}</div>
    </div>
  );
};

const Create: FC<unknown> = () => {
  const [name, setName] = useState<string>('');
  const [isCreate, setCreate] = useState<boolean>(false);

  return (
    <div>
      <input
        onChange={(e) => {
          setName(e.target.value);
        }}
        value={name}
      />
      <button onClick={() => setCreate(true)}>Создать</button>
      {isCreate && <WebsocketCreate />}
    </div>
  );
};

export const Connect: FC<unknown> = () => {
  const [step, setStep] = useState<'connect' | 'create' | null>(null);

  const hideModal = () => setStep(null);

  return (
    <div>
      <button onClick={() => setStep('create')}>Создать канал</button>
      <button onClick={() => setStep('connect')}>Подключиться к каналу</button>
      {step === 'create' && <Create />}
    </div>
  );
};
