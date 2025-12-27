import { Countries } from 'src/pages/Countries';
import { Main } from 'src/pages/Main';
import { RuAlphabetPrice } from 'src/pages/RuAlphabetPrice';

export const YANDEX_API_KEY = '8fddd0c8-b9bc-4d8c-b4ed-7d010d31875d';
export const YANDEX_MAPS_URL = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_API_KEY}&lang=ru_RU`;

export const CHANNEL_URL_PARAM = 'channelId';

export const USER_NAMES = {
  my: 'Ясь',
  another: 'Ждусь',
};

export const ROUTES = {
  main: {
    path: '/',
    Component: Countries,
    title: 'Соседи',
  },
  map: {
    path: '/map',
    Component: Main,
    title: 'Главная',
  },
  ruAlphabet: {
    path: '/ru-alphabet',
    Component: RuAlphabetPrice,
    title: 'Цена буквы',
  },
};
