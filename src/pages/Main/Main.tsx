import { FC, useEffect, useState } from 'react';
import { withLayout } from '@utils/HOCs/withLayout';
import { Map } from '@containers/Map';
import { TPosition } from '@node/types/WS';
import { Modal } from 'antd';
import { getGeolocation } from '@utils/getGetlocation';

export const Main: FC<object> = withLayout(() => {
  const [position, setPosition] = useState<TPosition | null>(null);
  const [isModalGeo, setIsModalGeо] = useState<boolean>(false);

  useEffect(() => {
    getGeolocation()
      .then(({ coords }) => {
        setPosition([coords.latitude, coords.longitude]);
      })
      .catch((error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.log('Геолокация отключена пользователем');
          setIsModalGeо(true);
        } else {
          console.log('Ошибка геолокации:', error.message);
        }
      });
  }, []);

  return (
    <>
      {position ? <Map initialPosition={position} /> : null}
      <Modal
        title="Ошибка геолокации"
        open={isModalGeo}
        onOk={() => {
          getGeolocation().then(({ coords }) => {
            setPosition([coords.latitude, coords.longitude]);
            setIsModalGeо(false);
          });
        }}
      >
        Внимание! Для работы приложения необходимо включить геоколокацию!
      </Modal>
    </>
  );
});
