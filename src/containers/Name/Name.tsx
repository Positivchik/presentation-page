import { WebsocketCreate } from '@components/Connect/WebsocketCreate';
import { WebsocketConnect } from '@components/Connect/WebsocketUpdate';
import { FC, useState } from 'react';

interface NameProps {
  type: 'create' | 'connect';
}

export const Name: FC<NameProps> = ({ type }) => {
  const [name, setName] = useState<string>('');
  const [isReady, setReady] = useState<boolean>(false);

  const Component = type === 'create' ? WebsocketCreate : WebsocketConnect;

  return (
    <div>
      <input
        onChange={(e) => {
          setName(e.target.value);
        }}
        value={name}
      />
      <button onClick={() => setReady(true)}>Создать</button>
      {isReady && <Component name={name} />}
    </div>
  );
};
