import React from 'react';
import ReactDOM from 'react-dom/client';
import { Main } from './pages/Main';
import { Location } from './pages/Location';
import { Map } from '@containers/Map';

import styled from '@emotion/styled'
import 'reset-css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Global } from '@emotion/react'

const Globals = styled.div`
  * {
    box-sizing: border-box;
  }
`

const router = createBrowserRouter([
  {
    path: "/",
    element:  <Main />,
  },
  {
    path: "/location/",
    element:  <Location />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <div>
        <Global
      styles={{
        '.ymaps-2-1-79-copyrights-pane': {
          display: 'none',
        }
      }}
    />
    <Globals>
    <RouterProvider router={router} />
    </Globals>
    </div>
);



