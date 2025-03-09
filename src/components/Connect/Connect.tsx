import { FC, useState } from 'react';
import { SocketIOConnect, SocketIOConnectProps } from './SocketIOConnect';
import { TPosition } from '@node/types/WS';
import { Button, Flex, Modal, Typography } from 'antd';
import {
  StyledBlock,
  StyledBlockWrapper,
  StyledButtonsWrapper,
} from './Connect.styled';
import { JoinModal } from './JoinModal';
import { CHANNEL_URL_PARAM } from '@constants/index';
const { Paragraph } = Typography;

export const Connect: FC<{
  position: TPosition;
  setAnotherPosition: SocketIOConnectProps['setAnotherPosition'];
}> = ({ position, setAnotherPosition }) => {
  const [step, setStep] = useState<SocketIOConnectProps['type'] | null>(null);
  const [channelId, setChannelId] = useState<string | undefined>();
  const [status, setStatus] = useState<null | SocketIOConnectProps['type']>(
    null
  );
  const [createChannelId, setCreateChannelId] = useState<null | string>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div>
      {/* <Modal
        title="Создать канал"
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
      </Modal> */}

      <StyledButtonsWrapper>
        <Flex gap={8}>
          <Modal
            title="Канал создан!"
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          >
            <StyledBlockWrapper>
              <StyledBlock>{createChannelId}</StyledBlock>
            </StyledBlockWrapper>
            <Paragraph
              copyable
            >{`${window.location.origin}?${CHANNEL_URL_PARAM}=${createChannelId}`}</Paragraph>
          </Modal>
          <Button
            color="primary"
            variant="filled"
            disabled={!!status}
            onClick={() => setStep('create')}
          >
            Создать канал
          </Button>
          <JoinModal
            onOk={(channelId) => {
              setChannelId(channelId);
              setStep('connect');
            }}
            isDisabled={!!status}
          />
        </Flex>
      </StyledButtonsWrapper>
      {step && (
        <SocketIOConnect
          position={position}
          setAnotherPosition={setAnotherPosition}
          type={step}
          channelId={channelId}
          onClose={() => setStep(null)}
          onOpen={(v) => setStatus(v)}
          onCreate={(channelId) => {
            setCreateChannelId(channelId);
            setIsModalOpen(true);
          }}
        />
      )}
    </div>
  );
};
