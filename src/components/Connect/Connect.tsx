import { FC, useState } from 'react';
import { WebsocketConnect } from './WebsocketConnect';

export const Connect: FC<{
  position: [number, number];
  addMapObject: (any: any[]) => void;
}> = ({ position, addMapObject }) => {
  const [step, setStep] = useState<'connect' | 'create' | null>(null);
  const [name, setName] = useState<string>('');

  return (
    <div>
      <div>
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
        />
      </div>
      <button onClick={() => setStep('create')} disabled={!name}>
        Создать канал
      </button>
      <button onClick={() => setStep('connect')} disabled={!name}>
        Подключиться к каналу
      </button>
      {step && (
        <WebsocketConnect
          name={name}
          position={position}
          addMapObject={addMapObject}
          type={step}
        />
      )}
    </div>
  );
};
