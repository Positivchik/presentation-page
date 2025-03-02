import { YANDEX_MAPS_URL } from '@constants/index';
import { TPosition } from '@node/types/WS';
import { FC, useEffect, useRef } from 'react';
import ymaps from 'yandex-maps';

interface YandexMapProps {
  initialPosition: TPosition;
  onInit: (map: ymaps.Map) => void;
}

export const YandexMap: FC<YandexMapProps> = ({ initialPosition, onInit }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let map: null | ymaps.Map = null;
    if (mapRef.current) {
      const initMap = (element: HTMLDivElement) => {
        map = new window.ymaps.Map(element, {
          center: initialPosition,
          controls: [],
          zoom: 12,
        });
        onInit(map);
      };
      const loadScript = () => {
        const script = document.createElement('script');
        script.src = YANDEX_MAPS_URL;
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
