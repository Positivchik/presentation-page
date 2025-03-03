export const getGeolocation = () => {
  return new Promise<GeolocationPosition>((res, rej) => {
    window.navigator?.geolocation.getCurrentPosition(res, rej, {
      enableHighAccuracy: true,
    });
  });
};
