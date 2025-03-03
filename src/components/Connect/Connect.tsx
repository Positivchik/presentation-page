import { FC, useEffect, useState } from 'react';
import { WebsocketConnect, WebsocketConnectProps } from './WebsocketConnect';
import { TPosition } from '@node/types/WS';
import { getUrlParam } from '@utils/getUrlParam';
import { CHANNEL_URL_PARAM } from '@constants/index';
import { Button, Flex, Input, Modal } from 'antd';

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (channelId) {
      setIsModalOpen(true);
    }
  }, []);

  return (
    <div>
      <Modal
        title="Подключение"
        open={isModalOpen}
        onOk={() => {
          setStep('connect');
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          placeholder="Введите номер канала"
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
        />
      </Modal>
      <div
        style={{
          position: 'absolute',
          zIndex: 1,
        }}
      >
        {/* <input
          placeholder="ИД канала"
          onChange={(e) => {
            setChannelId(e.target.value);
          }}
          value={channelId}
          disabled={!!status}
        /> */}
        <Flex gap={8}>
          <Button
            color="primary"
            variant="filled"
            disabled={!!status}
            onClick={() => setStep('create')}
          >
            Создать
          </Button>
          <Button
            color="primary"
            variant="filled"
            // disabled={!channelId || !!status}
            disabled={!!status}
            onClick={() => setIsModalOpen(true)}
          >
            Подключиться
          </Button>
        </Flex>
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
