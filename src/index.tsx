import ReactDOM from 'react-dom/client';
import { Main } from './pages/Main';

import 'reset-css';
import { Global } from '@emotion/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <div>
    <Global
      styles={{
        '*': {
          boxSizing: 'border-box',
        },
        '.ymaps-2-1-79-copyrights-pane': {
          display: 'none',
        },
      }}
    />
    <Main />
  </div>
);
