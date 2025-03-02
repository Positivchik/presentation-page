import { useWebSocket } from '@utils/useWebSocket';
import { FC, useState } from 'react';

interface WebsocketConnectProps {
  name: string;
}

export const WebsocketConnect: FC<WebsocketConnectProps> = ({ name }) => {
  const { messages, sendMessage } = useWebSocket(
    'ws://localhost:8080',
    (ws) => {
      ws.send(
        JSON.stringify({
          type: 'create',
          payload: name,
        })
      );
    }
  );
  const [message, setMessage] = useState<string>('');

  return (
    <div>
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
