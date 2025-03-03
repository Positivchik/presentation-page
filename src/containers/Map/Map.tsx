import { YandexMap } from '@components/YandexMap';
import { FC, useEffect, useState } from 'react';
import type ymaps from 'yandex-maps';
import { Connect } from '@components/Connect';
import { TPosition, TUpdatePayload } from '@node/types/WS';
import { createPoint } from '@utils/createGetPoint';
import { Flexbox } from '@components/Flexbox';
import { USER_NAMES } from '@constants/index';

export type TAnotherPositionState = TUpdatePayload | null;

interface MapProps {
  initialPosition: TPosition;
}

export const Map: FC<MapProps> = ({ initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);
  const [map, setMap] = useState<null | ymaps.Map>(null);
  const [anotherPosition, setAnotherPosition] =
    useState<TAnotherPositionState>(null);

  useEffect(() => {
    navigator.geolocation.watchPosition(
      (position) => {
        setPosition([position.coords.latitude, position.coords.longitude]);
      },
      (error) => console.error('Ошибка:', error),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    if (map && position) {
      const point = createPoint(USER_NAMES.my, position);
      map.geoObjects.add(point);

      return () => {
        map.geoObjects.remove(point);
      };
    }
  }, [map, position]);

  useEffect(() => {
    if (map && anotherPosition) {
      const secondObject = createPoint(
        USER_NAMES.another,
        anotherPosition.position
      );
      map.geoObjects.add(secondObject);

      return () => {
        map.geoObjects.remove(secondObject);
      };
    }
  }, [map, anotherPosition]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(({ coords }) => {
      setPosition([coords.latitude, coords.longitude]);
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <Flexbox flexDirection="column" height="100vh">
      <Connect position={position} setAnotherPosition={setAnotherPosition} />
      {position && (
        <YandexMap
          initialPosition={position}
          onInit={(map) => {
            setMap(map);
          }}
        />
      )}
    </Flexbox>
  );
};
