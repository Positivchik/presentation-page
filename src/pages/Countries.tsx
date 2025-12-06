import {
  COUNTRIES,
  COUNTRIES_NEIGHTBOURS,
  Country,
} from '@constants/countries';
import { AutoComplete } from 'antd';
import React, { FC, useState } from 'react';

const getRandomNumber = (min = 0, max = 200) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const MAX_ERRORS = 3;

export const Countries: FC = () => {
  const [input, setInput] = useState<string>('');
  const [errorsCount, setErrorsCount] = useState<number>(MAX_ERRORS);
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    COUNTRIES[getRandomNumber(0, COUNTRIES.length)]
  );

  const handleGenerateNewQuestion = () => {
    const selectCountryNumber = getRandomNumber(0, COUNTRIES.length);
    setSelectedCountry(COUNTRIES[selectCountryNumber]);
  };

  // Страны континенты
  // Выбери количество соседей
  // Какая столица
  return (
    <section>
      <h1>Игра &quot;Страны-соседи&quot;</h1>
      <div>Максимально ошибок: 3, осталось {errorsCount}</div>
      <div>{selectedCountry}</div>
      <AutoComplete
        value={input}
        options={COUNTRIES.filter((v) =>
          v.toLowerCase().includes(input.toLowerCase())
        ).map((value) => ({ value }))}
        style={{ width: 200 }}
        onSelect={setInput}
        onSearch={setInput}
        placeholder="input here"
      />
      <button
        onClick={() => {
          if (!COUNTRIES_NEIGHTBOURS[selectedCountry]) {
            alert('Заведи страны соседи:' + selectedCountry);
            return;
          }
          if (
            COUNTRIES_NEIGHTBOURS[selectedCountry].some(
              (country) => country === input
            )
          ) {
            alert(
              'Угадал! Страна:' + selectedCountry + 'имеет соседа:' + input
            );
          } else {
            alert('Не угадал!');
          }
        }}
      >
        Проверь
      </button>

      <button onClick={handleGenerateNewQuestion}>Выбрать другую</button>
    </section>
  );
};
