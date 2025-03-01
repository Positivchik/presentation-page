import { FC, ReactNode } from 'react';

import styled from '@emotion/styled';
import { Menu } from '../Menu';

const StyledLayout = styled.div`
  max-width: 1312px;
  padding: 32px;
  border: 1px solid black;
  margin: 0 auto;
`;

const StyledLayoutInner = styled.div`
  border: 1px solid black;
`;

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <StyledLayout>
      <StyledLayoutInner>
        <Menu />
        {children}
        <footer>А тут футер, тут можно контакты оставить</footer>
      </StyledLayoutInner>
    </StyledLayout>
  );
};
