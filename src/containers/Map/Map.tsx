import { YandexMap } from '@components/YandexMap';
import { FC, useEffect, useState } from 'react';
import type ymaps from 'yandex-maps';
import { Connect } from '@components/Connect';
import { TPosition, TUpdatePayload } from '@node/types/WS';
import { createPoint } from '@utils/createGetPoint';
import { Flexbox } from '@components/Flexbox';

interface MapProps {
  initialPosition: TPosition;
}

export const Map: FC<MapProps> = ({ initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);
  const [map, setMap] = useState<null | ymaps.Map>(null);
  const [otherPositions, setOtherPointers] = useState<TUpdatePayload[]>([]);

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
      const point = createPoint('Я', position);
      map.geoObjects.add(point);

      return () => {
        map.geoObjects.remove(point);
      };
    }
  }, [map, position]);

  useEffect(() => {
    if (map && otherPositions.length) {
      const createdObjects = otherPositions.map(({ name, position }) =>
        createPoint(name, position)
      );
      createdObjects.forEach((obj) => {
        map.geoObjects.add(obj);
      });

      return () => {
        createdObjects.forEach((obj) => {
          map.geoObjects.remove(obj);
        });
      };
    }
  }, [map, otherPositions]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(({ coords }) => {
      setPosition([coords.latitude, coords.longitude]);
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <Flexbox flexDirection="column" height="100vh">
      <Connect
        position={position}
        addPoints={(data) => {
          setOtherPointers(data);
        }}
      />
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
