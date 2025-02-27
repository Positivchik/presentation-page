import { FC } from "react";
import { withLayout } from "../../utils/HOCs/withLayout";

import styled from '@emotion/styled'

const Title = styled.h1`
  color: red;
`;

export const Main: FC<any> = withLayout(() => {
    return <Title>Привет, прошу прощения, я ещё не решил что тут будет</Title>
})