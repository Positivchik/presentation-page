import React, { FC, ReactNode } from 'react';

interface FlexboxProps {
  children: ReactNode;
  tag?: string;
  gap?: number;
  flexDirection?: 'column' | 'row';
  height?: string;
}

export const Flexbox: FC<FlexboxProps> = ({
  children,
  tag = 'div',
  gap,
  flexDirection = 'row',
  height,
}) => {
  return React.createElement(
    tag,
    { style: { display: 'flex', gap, flexDirection, height } },
    children
  );
};
