import { FC, useEffect, useState } from 'react';
import { withLayout } from '@utils/HOCs/withLayout';
import { Map } from '@containers/Map';
import { TPosition } from '@node/types/WS';

export const Main: FC<object> = withLayout(() => {
  const [position, setPosition] = useState<TPosition | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition([coords.latitude, coords.longitude]);
      },
      (error) => console.error('Ошибка геолокации:', error),
      { enableHighAccuracy: true }
    );
  }, []);

  return position ? <Map initialPosition={position} /> : null;
});
