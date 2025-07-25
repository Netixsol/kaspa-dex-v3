import styled from "styled-components";
import { flexbox } from "styled-system";
import Box from "./Box";
import { FlexProps } from "./types";

const Flex = styled(Box)<FlexProps>`
  display: flex;
  tex-align: center;

  flex-shrink: 0;
  ${flexbox}
  @media screen and (max-width: 768px) {
    text-align: left;
  }
`;

export default Flex;
