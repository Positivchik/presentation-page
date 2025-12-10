import { COUNTRIES, COUNTRIES_NEIGHTBOURS, Country } from '@constants/countries';
import { FLAGS } from '@constants/icons';
import { AutoComplete, notification } from 'antd';
import React, { FC, useState } from 'react';

const getRandomNumber = (min = 0, max = 200) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const Countries: FC = () => {
  const [passedList, setPassedList] = useState<Country[]>([]);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [input, setInput] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[getRandomNumber(0, COUNTRIES.length)]);

  const foundNotFilledCountry = Object.values(Country).find((name) => !COUNTRIES_NEIGHTBOURS[name]);
  if (foundNotFilledCountry) {
    alert('Заполни соседей: ' + foundNotFilledCountry + '. Заполнено: ' + Object.values(COUNTRIES_NEIGHTBOURS).length + ' из ' + COUNTRIES.length);
  }

  const handleGenerateNewQuestion = () => {
    const selectCountryNumber = getRandomNumber(0, COUNTRIES.length);
    const newCountry = COUNTRIES[selectCountryNumber];
    if (passedList.includes(newCountry)) {
      handleGenerateNewQuestion();
      return;
    }
    setSelectedCountry(newCountry);
  };

  const handleCheck = () => {
    if (!COUNTRIES_NEIGHTBOURS[selectedCountry]) {
      alert('Заведи страны соседи:' + selectedCountry);
      return;
    }
    const isFoundNeighbour = COUNTRIES_NEIGHTBOURS[selectedCountry].some((country) => country === input);

    const isNoNeighbour = !input.length && COUNTRIES_NEIGHTBOURS[selectedCountry].length === 0;

    if (isFoundNeighbour || isNoNeighbour) {
      // alert(
      //   'Угадал! Страна:' + selectedCountry + 'имеет соседа:' + input
      // );
      handleGenerateNewQuestion();
      setPassedList(passedList.concat(selectedCountry));
      notification['success']({
        title: 'Верно!',
        description: `Страна ${selectedCountry} является соседом ${input}`,
      });
      setInput('');
    } else {
      setErrorsCount(errorsCount + 1);
      notification['error']({
        title: 'Не правильно!',
        description: `Страна ${selectedCountry} НЕ является соседом ${input}`,
      });
    }
  };

  // Флаги
  // Столицы
  // Страны континенты
  // Выбери количество соседей
  // Какая столица
  return (
    <section>
      <h1>Игра &quot;Страны-соседи&quot;</h1>
      <div>
        Пройдено: {passedList.length} из {COUNTRIES.length}
      </div>
      <div>Ошибок: {errorsCount}</div>

      <div>
        {selectedCountry}: {FLAGS[selectedCountry]}
      </div>
      <AutoComplete
        value={input}
        options={COUNTRIES.filter((v) => v.toLowerCase().includes(input.toLowerCase())).map((value) => ({ value }))}
        style={{ width: 200 }}
        onSelect={setInput}
        onSearch={setInput}
        placeholder="input here"
      />
      <button onClick={handleCheck}>Соседей нету!</button>
      <button disabled={!input} onClick={handleCheck}>
        Проверь
      </button>

      <button disabled={passedList.length < COUNTRIES.length} onClick={handleGenerateNewQuestion}>
        Выбрать другую
      </button>
      <button
        onClick={() => {
          setPassedList([]);
          setErrorsCount(0);
          handleGenerateNewQuestion();
        }}
      >
        Обнулить
      </button>
    </section>
  );
};
