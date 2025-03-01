import { FC } from 'react';
import { withLayout } from '../../utils/HOCs/withLayout';

import styled from '@emotion/styled';

const Title = styled.h1`
  color: red;
`;

export const Location: FC<any> = withLayout(() => {
  return <Title>Location</Title>;
});
