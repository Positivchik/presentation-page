import { FC, useState } from 'react';
import { WebsocketConnect, WebsocketConnectProps } from './WebsocketConnect';
import { TPosition } from '@node/types/WS';
import { getUrlParam } from '@utils/getUrlParam';
import { CHANNEL_URL_PARAM } from '@constants/index';

export const Connect: FC<{
  position: TPosition;
  setAnotherPosition: WebsocketConnectProps['setAnotherPosition'];
}> = ({ position, setAnotherPosition }) => {
  const [step, setStep] = useState<WebsocketConnectProps['type'] | null>(null);
  const [channelId, setChannelId] = useState<string>(
    getUrlParam(CHANNEL_URL_PARAM) || ''
  );
  const [status, setStatus] = useState<null | WebsocketConnectProps['type']>(
    null
  );

  return (
    <div>
      <div>
        <button onClick={() => setStep('create')} disabled={!!status}>
          Создать канал
        </button>
      </div>
      <div>
        <input
          placeholder="ИД канала"
          onChange={(e) => {
            setChannelId(e.target.value);
          }}
          value={channelId}
          disabled={!!status}
        />
        <button
          onClick={() => setStep('connect')}
          disabled={!channelId || !!status}
        >
          Подключиться
        </button>
      </div>
      {step && (
        <WebsocketConnect
          position={position}
          setAnotherPosition={setAnotherPosition}
          type={step}
          channelId={channelId}
          onClose={() => setStep(null)}
          onOpen={(v) => setStatus(v)}
        />
      )}
    </div>
  );
};
