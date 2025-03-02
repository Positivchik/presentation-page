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
  const [otherPositions, setOtherPointers] = useState<
    { id: string; name: string; position: [number, number] }[]
  >([]);
  console.log({otherPositions, position});

  useEffect(() => {
    navigator.geolocation.watchPosition(
      (position) => {
        // if (!position || getDistance(position, position) > 10) {
        //   setPosition([position.coords.latitude, position.coords.longitude]);
        // }
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

  //// ----
  useEffect(() => {
    if (map && otherPositions.length) {
      const createdObjects = otherPositions.map(({ name, position }) => {
        return new window.ymaps.GeoObject(
          {
            geometry: {
              type: 'Point',
              // @ts-expect-error coordinates don't exist in types
              coordinates: position,
            },
            properties: {
              iconContent: name,
            },
          },
          {
            preset: 'islands#blackStretchyIcon',
            draggable: false,
          }
        );
      });

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
  /// -----
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(({ coords }) => {
      setPosition([coords.latitude, coords.longitude]);
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div>
      <Connect
        position={position}
        addMapObject={(any: any[]) => {
          setOtherPointers(any);
        }}
      />
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
