import { getDistance } from '@utils/getDistance';
import { FC, useEffect, useState } from 'react';
import ymaps from 'yandex-maps';

interface MapProps {
  initialPosition: [number, number];
}

export const Map: FC<MapProps> = ({ initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    navigator.geolocation.watchPosition(
      (position) => {
        if (!position || getDistance(position, position) > 10) {
          //   sendToServer(position);
          setPosition([position.coords.latitude, position.coords.longitude]);
        }
      },
      (error) => console.error('Ошибка:', error),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  useEffect(() => {
    ymaps.ready(init);
    let myMap: any;
    function init() {
      myMap = new ymaps.Map('map', {
        center: [54.1809877, 28.4676561],
        // от 0 (весь мир) до 19.
        zoom: 15,
        controls: [],
      });

      const myGeoObject = new ymaps.GeoObject(
        {
          // Описание геометрии.
          geometry: {
            type: 'Point',
            coordinates: [54.1809877, 28.4676561],
          },
          // Свойства.
          properties: {
            iconContent: 'Я',
          },
        },
        {
          // Опции.
          // Иконка метки будет растягиваться под размер ее содержимого.
          preset: 'islands#blackStretchyIcon',
          // Метку можно перемещать.
          draggable: false,
        }
      );

      const myGeoObject2 = new ymaps.GeoObject(
        {
          // Описание геометрии.
          geometry: {
            type: 'Point',
            coordinates: [54.181998, 28.4676561],
          },
          // Свойства.
          properties: {
            // Контент метки.
            iconContent: 'Я тащусь2',
            hintContent: 'Ну давай уже тащи',
          },
        },
        {
          // Опции.
          // Иконка метки будет растягиваться под размер ее содержимого.
          preset: 'islands#blackStretchyIcon',
          // Метку можно перемещать.
          draggable: false,
        }
      );

      myMap.geoObjects.add(myGeoObject);
      // .add(myGeoObject2)

      // setTimeout(() => {
      //   console.log('timeout',myMap)
      //   myMap.geoObjects
      //   .remove(myGeoObject)
      // }, 5000)
    }

    return () => {
      console.log(myMap);
      myMap?.destroy();
    };
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(({ coords }) => {
      setPosition([coords.latitude, coords.longitude]);
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return <div>map</div>;
};
