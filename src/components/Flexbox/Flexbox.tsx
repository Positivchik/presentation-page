import React, { FC, ReactNode } from 'react';

interface FlexboxProps {
  children: ReactNode;
  tag?: string;
  gap?: number;
}

export const Flexbox: FC<FlexboxProps> = ({ children, tag = 'div', gap }) => {
  return React.createElement(
    tag,
    { style: { display: 'flex', gap } },
    children
  );
};
