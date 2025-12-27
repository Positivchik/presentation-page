import { COUNTRIES, COUNTRIES_NEIGHTBOURS, Country } from '@constants/countries';
import { FLAGS } from '@constants/icons';
import { notification } from 'antd';
import React, { FC, useMemo, useState } from 'react';

const getRandomNumber = (min = 0, max = 200) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const RuAlphabetPrice: FC = () => {
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

  const sidedCountriesMap = useMemo(() => {
    return Object.fromEntries((COUNTRIES_NEIGHTBOURS[selectedCountry] || []).map((country) => [country, true])) as Record<Country, true>;
  }, [selectedCountry]);

  const notSideCountries = useMemo(() => {
    return Object.values(Country).filter((country) => !sidedCountriesMap[country]);
  }, [sidedCountriesMap]);

  const mixedCountries = useMemo(() => {
    const sidedCountries = Object.keys(sidedCountriesMap) as Country[];
    const correctCountry: Country | undefined = sidedCountries[getRandomNumber(0, sidedCountries.length - 1)];

    const MAX_COUNTRIES = 4;

    const foundMaxCountries = (() => {
      const countries: Country[] = [];

      if (correctCountry) {
        countries.push(correctCountry);
      }

      while (countries.length < MAX_COUNTRIES) {
        const foundCountry = notSideCountries[getRandomNumber(0, notSideCountries.length - 1)];
        const isAlready = countries.includes(foundCountry);
        if (isAlready) continue;

        countries.push(foundCountry);
      }

      return countries;
    })();

    const shuffledCountries = foundMaxCountries.sort(() => Math.random() - 0.5);

    return Object.keys(Object.fromEntries(shuffledCountries.map((v) => [v, true]))) as Country[];
  }, [notSideCountries, sidedCountriesMap]);

  const handleSelectCountry = (country: Country) => {
    const isNoNeighbour = COUNTRIES_NEIGHTBOURS[country].length === 0;
    if (isNoNeighbour) {
      setErrorsCount((prev) => prev + 1);
      return;
    }

    const isNeighbour = COUNTRIES_NEIGHTBOURS[country].includes(selectedCountry);
    if (isNeighbour) {
      setPassedList((prev) => prev.concat(selectedCountry));
      setSelectedCountry(notSideCountries[getRandomNumber(0, notSideCountries.length - 1)]);
      return;
    }
    setErrorsCount((prev) => prev + 1);
  };

  return (
    <section>
      <h1>Игра &quot;Цена буквы&quot;</h1>
      <div>
        Пройдено: {passedList.length} из {COUNTRIES.length}
      </div>
      <div>Ошибок: {errorsCount}</div>
      <div>
        {selectedCountry}: {FLAGS[selectedCountry]}
      </div>

      {mixedCountries.map((country) => {
        return (
          <button
            key={country}
            onClick={() => {
              handleSelectCountry(country);
              // setInput(country);
              // handleCheck();
            }}
          >
            {country}: {FLAGS[country]}
          </button>
        );
      })}
      <br />
      {/* <AutoComplete
        value={input}
        options={COUNTRIES.filter((v) => v.toLowerCase().includes(input.toLowerCase())).map((value) => ({ value }))}
        style={{ width: 200 }}
        onSelect={setInput}
        onSearch={setInput}
        placeholder="input here"
      /> */}

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
