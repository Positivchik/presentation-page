import { FC, useEffect, useState } from "react"

interface MapProps {
    initialPosition: [number, number];
}

function getDistance(pos1: any, pos2: any) {
    const R = 6371e3; // Радиус Земли в метрах
    const φ1 = (pos1.coords.latitude * Math.PI) / 180;
    const φ2 = (pos2.coords.latitude * Math.PI) / 180;
    const Δφ = ((pos2.coords.latitude - pos1.coords.latitude) * Math.PI) / 180;
    const Δλ = ((pos2.coords.longitude - pos1.coords.longitude) * Math.PI) / 180;
  
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c; // Дистанция в метрах
  }

export const Map:FC<MapProps> = ({ initialPosition }) => {
    const [position, setPosition] = useState(initialPosition);

    useEffect(() => {
        navigator.geolocation.watchPosition((position) => {
            if (!position || getDistance(position, position) > 10) {
            //   sendToServer(position);
            setPosition([position.coords.latitude, position.coords.longitude])
            }
          },
          (error) => console.error("Ошибка:", error),
          { enableHighAccuracy: true, timeout: 5000, }
        );
    }, [])

    useEffect(() => {
        // @ts-ignore
ymaps.ready(init);
let myMap: any;
function init(){
    // @ts-ignore
    myMap = new ymaps.Map("map", {
        center: [54.1809877, 28.4676561],
        // от 0 (весь мир) до 19.
        zoom: 15,
        controls: [],
        options: {
          suppressMapOpenBlock: true,  // Hide "Open in Yandex Maps"
          yandexMapDisablePoiInteractivity: true,  // Disable POI interactivity
          suppressObsoleteBrowserNotifier: true,  // Hide outdated browser notification
          copyrightProviders: [],  // Hide Yandex logo and links
        }
    });

    // @ts-ignore
    const myGeoObject = new ymaps.GeoObject({
      // Описание геометрии.
      geometry: {
          type: "Point",
          coordinates: [54.1809877, 28.4676561]
      },
      // Свойства.
      properties: {
          iconContent: 'Я',
      }
  }, {
      // Опции.
      // Иконка метки будет растягиваться под размер ее содержимого.
      preset: 'islands#blackStretchyIcon',
      // Метку можно перемещать.
      draggable: false
  })

      // @ts-ignore
      const myGeoObject2 = new ymaps.GeoObject({
        // Описание геометрии.
        geometry: {
            type: "Point",
            coordinates: [54.1819980, 28.4676561]
        },
        // Свойства.
        properties: {
            // Контент метки.
            iconContent: 'Я тащусь2',
            hintContent: 'Ну давай уже тащи'
        }
    }, {
        // Опции.
        // Иконка метки будет растягиваться под размер ее содержимого.
        preset: 'islands#blackStretchyIcon',
        // Метку можно перемещать.
        draggable: false
    })

    myMap.geoObjects
    .add(myGeoObject)
    // .add(myGeoObject2)

    // setTimeout(() => {
    //   console.log('timeout',myMap)
    //   myMap.geoObjects
    //   .remove(myGeoObject)
    // }, 5000)
}

return () => {
    console.log(myMap)
          // @ts-ignore
          myMap?.destroy()
}
    }, [])

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(({ coords }) => {
          setPosition([coords.latitude, coords.longitude]);
        });
      
        return () => navigator.geolocation.clearWatch(watchId);
      }, []);

    return <div>map</div>
}