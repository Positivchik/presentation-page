import { TPosition } from '@node/types/WS';

export const createPoint = (name: string, position: TPosition) => {
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
};
