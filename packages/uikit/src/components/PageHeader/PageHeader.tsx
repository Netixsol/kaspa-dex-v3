import styled from "styled-components";
import { Box } from "../Box";
import Container from "../Layouts/Container";
import { PageHeaderProps } from "./types";

const Outer = styled(Box)<{ background?: string }>`
  padding-top: 32px;
  padding-bottom: 32px;
  background: ${({ theme, background }) => background || theme.colors.gradientBubblegum};
  max-width: 1200px;
  margin: 0 auto;
`;

const Inner = styled(Container)`
  padding-top: 32px;
  position: relative;
  @media screen and (max-width: 1400px) {
    padding: 20px;
  }
`;

const PageHeader: React.FC<React.PropsWithChildren<PageHeaderProps>> = ({ background, children, ...props }) => (
  <Outer background={background} {...props}>
    <Inner>{children}</Inner>
  </Outer>
);

export default PageHeader;
