import { FC, useState } from 'react';
import { WebsocketConnect, WebsocketConnectProps } from './WebsocketConnect';
import { TPosition } from '@node/types/WS';
import { getUrlParam } from '@utils/getUrlParam';
import { CHANNEL_URL_PARAM } from '@constants/index';
import { Flexbox } from '@components/Flexbox';

export const Connect: FC<{
  position: TPosition;
  addPoints: WebsocketConnectProps['addPoints'];
}> = ({ position, addPoints }) => {
  const [step, setStep] = useState<WebsocketConnectProps['type'] | null>(null);
  const [name, setName] = useState<string>('');
  const [channelId, setChannelId] = useState<string>(
    getUrlParam(CHANNEL_URL_PARAM) || ''
  );

  return (
    <div>
      <div>
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
        />

        <button onClick={() => setStep('create')} disabled={!name}>
          Создать канал
        </button>
      </div>
      <div>
        <input
          onChange={(e) => {
            setChannelId(e.target.value);
          }}
          value={channelId}
        />
        <button onClick={() => setStep('connect')} disabled={!channelId}>
          Подключиться к каналу
        </button>
      </div>
      {step && (
        <WebsocketConnect
          name={name}
          position={position}
          addPoints={addPoints}
          type={step}
          channelId={channelId}
        />
      )}
    </div>
  );
};
