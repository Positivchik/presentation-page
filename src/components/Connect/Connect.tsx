import { FC, useState } from 'react';
import { Name } from '@containers/Name';

export const Connect: FC<unknown> = () => {
  const [step, setStep] = useState<'connect' | 'create' | null>(null);

  const hideModal = () => setStep(null);

  return (
    <div>
      <button onClick={() => setStep('create')}>Создать канал</button>
      <button onClick={() => setStep('connect')}>Подключиться к каналу</button>
      {step && <Name type={step} />}
    </div>
  );
};
