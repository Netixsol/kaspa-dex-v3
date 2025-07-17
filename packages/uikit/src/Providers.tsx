import { ThemeProvider, DefaultTheme } from "styled-components";
import { MatchBreakpointsProvider } from "./contexts/MatchBreakpoints/Provider";
import { ToastsProvider } from "./contexts/ToastsContext/Provider";
import { dark } from "./theme";

export const UIKitProvider: React.FC<React.PropsWithChildren<{ theme: DefaultTheme; children: React.ReactNode }>> = ({
  theme,
  children,
}) => {
  return (
    <ThemeProvider theme={dark}>
      <MatchBreakpointsProvider>
        <ToastsProvider>{children}</ToastsProvider>
      </MatchBreakpointsProvider>
    </ThemeProvider>
  );
};
