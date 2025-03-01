import React, { FC, useEffect, useRef } from 'react';
import ymaps from 'yandex-maps';

interface YandexMapProps {
  initialPosition: [number, number];
  apiKey: string;
  onInit: (map: ymaps.Map) => void;
}

export const YandexMap: FC<YandexMapProps> = ({
  apiKey,
  initialPosition,
  onInit,
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let map: null | ymaps.Map = null;
    if (mapRef.current) {
      const initMap = (element: HTMLDivElement) => {
        map = new window.ymaps.Map(element, {
          center: initialPosition,
          controls: [],
          zoom: 15,
        });
        onInit(map);
      };
      const loadScript = () => {
        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
        script.async = true;
        script.onload = () => {
          window.ymaps.ready(() => initMap(mapRef.current as HTMLDivElement));
        };
        document.body.appendChild(script);
      };
      if (!window.ymaps) {
        loadScript();
      }
      return () => {
        map?.destroy();
      };
    }
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};
