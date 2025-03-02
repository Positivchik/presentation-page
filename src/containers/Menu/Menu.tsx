import { FC } from 'react';
import { Flexbox } from '@components/Flexbox';
import { Link } from 'react-router-dom';
import { StyledMenuItem } from './Menu.styled';

export const Menu: FC<object> = () => {
  return (
    <Flexbox tag="nav" gap={10}>
      <StyledMenuItem>
        <Link to="/">Main</Link>
      </StyledMenuItem>
      <StyledMenuItem>
        <Link to="/location">Location</Link>
      </StyledMenuItem>
    </Flexbox>
  );
};
