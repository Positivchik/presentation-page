import React from 'react';
import ReactDOM from 'react-dom/client';
import { Main } from './pages/Main';

import styled from '@emotion/styled'

const Globals = styled.div`
  * {
    box-sizing: border-box;
  }
`

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Globals>
      <Main />
    </Globals>
  </React.StrictMode>
);
