import { FC, useEffect, useState } from 'react';
import { withLayout } from '../../utils/HOCs/withLayout';
import { Map } from '@containers/Map';

export const Main: FC<any> = withLayout(() => {
  const [position, setPosition] = useState<[number, number]>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        console.log(coords);
        setPosition([coords.latitude, coords.longitude]);
      },
      (error) => console.error('Ошибка геолокации:', error),
      { enableHighAccuracy: true }
    );
  }, []);

  return <div>{position && <Map initialPosition={position} />}</div>;
});
