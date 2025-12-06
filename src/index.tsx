import ReactDOM from 'react-dom/client';
import 'reset-css';
import { Global } from '@emotion/react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ROUTES } from './constants';
import { Menu } from 'antd';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
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
    <Menu mode="horizontal" defaultSelectedKeys={['game']}>
      <Menu.Item key="game">
        <Link to={ROUTES.main.path}>Главная</Link>
      </Menu.Item>
      <Menu.Item key="map">
        {' '}
        <Link to={ROUTES.map.path}>Карта</Link>
      </Menu.Item>
    </Menu>
    <Routes>
      {Object.values(ROUTES).map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  </BrowserRouter>
);
