import { YandexMap } from '@components/YandexMap';
import { FC, useEffect, useState } from 'react';
import { YANDEX_API_KEY } from '@constants/index';
import type ymaps from 'yandex-maps';
import { getDistance } from '@utils/getDistance';
import { Connect } from '@components/Connect';

interface MapProps {
  initialPosition: [number, number];
}

export const Map: FC<MapProps> = ({ initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);
  const [map, setMap] = useState<null | ymaps.Map>(null);

  useEffect(() => {
    console.log(position);
  }, [position]);

  useEffect(() => {
    navigator.geolocation.watchPosition(
      (position) => {
        if (!position || getDistance(position, position) > 10) {
          //   sendToServer(position);
          setPosition([position.coords.latitude, position.coords.longitude]);
        }
        // alert(JSON.stringify([position.coords.latitude, position.coords.longitude]));
        setPosition([position.coords.latitude, position.coords.longitude]);
      },
      (error) => console.error('Ошибка:', error),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    if (map && position) {
      const me = new window.ymaps.GeoObject(
        {
          geometry: {
            type: 'Point',
            // @ts-expect-error coordinates don't exist in types
            coordinates: position,
          },
          properties: {
            iconContent: 'Я',
          },
        },
        {
          preset: 'islands#blackStretchyIcon',
          draggable: false,
        }
      );
      map.geoObjects.add(me);

      return () => {
        map.geoObjects.remove(me);
      };
    }
  }, [map, position]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(({ coords }) => {
      setPosition([coords.latitude, coords.longitude]);
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div>
      <Connect />
      {position && (
        <YandexMap
          apiKey={YANDEX_API_KEY}
          initialPosition={position}
          onInit={(map) => {
            console.log({ map });
            setMap(map);
          }}
        />
      )}
    </div>
  );
};
