import ReactDOM from 'react-dom/client';
import 'reset-css';
import { Global } from '@emotion/react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { ROUTES } from './constants';
import { Menu } from 'antd';

const MainMenu = () => {
  const location = useLocation();

  return (
    <Menu mode="horizontal" defaultSelectedKeys={[location.pathname || Object.values(ROUTES)[0].path]}>
      {Object.entries(ROUTES).map(([, value]) => (
        <Menu.Item key={value.path}>
          <Link to={value.path}>{value.title}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );
};

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <MainMenu />
        <Routes>
          {Object.values(ROUTES).map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
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
    <App />
  </div>
);
