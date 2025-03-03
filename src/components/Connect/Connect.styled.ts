import { COLORS } from '@constants/colors';
import styled from '@emotion/styled';

export const StyledButtonsWrapper = styled.div`
  position: absolute;
  z-index: 1;
`;

export const StyledBlock = styled.div`
  border: 1px dashed ${COLORS.blue};
  padding: 8px;
`;

export const StyledBlockWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
