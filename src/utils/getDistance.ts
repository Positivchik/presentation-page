// export const getDistance = (pos1: any, pos2: any) => {
//   const R = 6371e3; // Радиус Земли в метрах
//   const φ1 = (pos1.coords.latitude * Math.PI) / 180;
//   const φ2 = (pos2.coords.latitude * Math.PI) / 180;
//   const Δφ = ((pos2.coords.latitude - pos1.coords.latitude) * Math.PI) / 180;
//   const Δλ = ((pos2.coords.longitude - pos1.coords.longitude) * Math.PI) / 180;

//   const a =
//     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
//     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c; // Дистанция в метрах
// };
