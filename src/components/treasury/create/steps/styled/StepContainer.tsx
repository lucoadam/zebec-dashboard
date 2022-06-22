import styled from "styled-components";
import { StepsContainerProps } from "components/treasury/create/CreateTreasury.d";

export const StepsContainer = styled.div<StepsContainerProps>`
  position: relative;
  &:after {
    position: absolute;
    left: 11px;
    height: 48px;
    width: 2.5px;
    top: 48px;
    margin-top: 0.5rem;
    content: ${(props: StepsContainerProps) => (props.isLast ? "none" : '""')};
    background-color: var(--outline-main);
  }
`;