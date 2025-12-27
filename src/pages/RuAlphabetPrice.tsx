import { RU_ALPHABET } from '@constants/alphabet';
import { getRandomNumber } from '@utils/getRandomNumber';
import { Input, notification } from 'antd';
import React, { FC, useState } from 'react';

// игра в соседи алфавита
// добавить алгоритм которы изучает необходимое количесто ввести символы, учитывая ошибки
// игры разума
export const RuAlphabetPrice: FC = () => {
  const [currentCharacter, setCurrentCharacter] = useState<string>(RU_ALPHABET[getRandomNumber(0, RU_ALPHABET.length - 1)]);
  const [passedList, setPassedList] = useState<string[]>([]);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [input, setInput] = useState<string>('');

  const generateNew = () => {
    setCurrentCharacter(RU_ALPHABET[getRandomNumber(0, RU_ALPHABET.length - 1)]);
  };

  const handleCheck = () => {
    const isCorrectNumber = Number(input) === RU_ALPHABET.findIndex((letter) => letter === currentCharacter) + 1;

    if (isCorrectNumber) {
      generateNew();
      if (!passedList.includes(currentCharacter)) setPassedList(passedList.concat(currentCharacter));
      notification['success']({
        title: 'Верно!',
        description: `Буква ${currentCharacter} под номером ${input}`,
      });
      setInput('');
    } else {
      setErrorsCount(errorsCount + 1);
      notification['error']({
        title: 'Не правильно!',
        description: `Буква ${currentCharacter} НЕ под номером ${input}`,
      });
    }
  };

  return (
    <section>
      <h1>Буква &quot;{currentCharacter}&quot;</h1>
      <div>
        Пройдено: {passedList.length} из {RU_ALPHABET.length}
      </div>
      <div>Ошибок: {errorsCount}</div>

      <Input
        placeholder="Цена буквы по алфавиту, от 1 до 33"
        onChange={(e) => {
          const value = Number(e.target.value);
          if (e.target.value === '' || (value >= 1 && value <= 33)) {
            setInput(e.target.value);
          }
        }}
        value={input}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleCheck();
          }
        }}
      />

      <button onClick={handleCheck}>Проверить</button>
    </section>
  );
};
