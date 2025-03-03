import { YANDEX_MAPS_URL } from '@constants/index';
import { TPosition } from '@node/types/WS';
import { FC, useEffect, useRef } from 'react';
import ymaps from 'yandex-maps';
import { StyledMap } from './YandexMap.styled';

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
          controls: ['zoomControl'],
          zoom: 12,
        });
        map.behaviors.enable('scrollZoom'); // Enable smooth zooming with scroll
        map.behaviors.enable('dblClickZoom'); // Enable double-click zoom
        map.behaviors.enable('multiTouch'); // Enable smooth zoom with touch gestures
        map.options.set('zoomAnimationDuration', 500);

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

  return <StyledMap ref={mapRef} />;
};
