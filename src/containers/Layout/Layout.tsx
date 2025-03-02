import { FC, ReactNode } from 'react';
import { StyledLayout, StyledLayoutInner } from './Layout.styled';
import { Footer } from '@components/Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <StyledLayout>
      <StyledLayoutInner>
        {children}
        <Footer />
      </StyledLayoutInner>
    </StyledLayout>
  );
};
