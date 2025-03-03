import { CHANNEL_URL_PARAM } from '@constants/index';
import { getUrlParam } from '@utils/getUrlParam';
import { Button, Input, Modal } from 'antd';
import { FC, useEffect, useState } from 'react';

interface JoinModalProps {
  onOk: (channelId: string) => void;
  isDisabled?: boolean;
}

export const JoinModal: FC<JoinModalProps> = ({ onOk, isDisabled }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [channelId, setChannelId] = useState<string>(
    getUrlParam(CHANNEL_URL_PARAM) || ''
  );

  useEffect(() => {
    if (channelId) {
      setIsModalOpen(true);
    }
  }, []);

  return (
    <>
      <Button
        color="primary"
        variant="filled"
        disabled={isDisabled}
        onClick={() => setIsModalOpen(true)}
      >
        Подключиться
      </Button>
      <Modal
        title="Подключение"
        open={isModalOpen}
        onOk={() => {
          onOk(channelId);
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
    </>
  );
};
