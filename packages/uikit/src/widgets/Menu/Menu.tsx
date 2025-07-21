import { useIsMounted } from "@pancakeswap/hooks";
import throttle from "lodash/throttle";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { AtomBox } from "../../components/AtomBox";
import BottomNav from "../../components/BottomNav";
import { Box } from "../../components/Box";
import Flex from "../../components/Box/Flex";
import CakePrice from "../../components/CakePrice/CakePrice";
import Footer from "../../components/Footer";
import LangSelector from "../../components/LangSelector/LangSelector";
import MenuItems from "../../components/MenuItems/MenuItems";
import { SubMenuItems } from "../../components/SubMenuItems";
import { useMatchBreakpoints } from "../../contexts";
import Logo from "./components/Logo";
import { MENU_HEIGHT, MOBILE_MENU_HEIGHT, TOP_BANNER_HEIGHT, TOP_BANNER_HEIGHT_MOBILE } from "./config";
import { MenuContext } from "./context";
import { NavProps } from "./types";

const HTMLWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  flex: 1;
  overflow: hidden;
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${MENU_HEIGHT}px;
  background-color: ${({ theme }) => theme.nav.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  transform: translate3d(0, 0, 0);
  padding-left: 40px;
  padding-right: 40px;
`;

const FixedContainer = styled("div").withConfig({
  shouldForwardProp: (props) => !["showMenu"].includes(props),
})<{ showMenu: boolean; height: number }>`
  position: fixed;
  top: ${({ showMenu, height }) => (showMenu ? 0 : `-${height}px`)};
  left: 0;
  transition: top 0.2s;
  height: ${({ height }) => `${height}px`};
  width: 100%;
  z-index: 20;
`;

const TopBannerContainer = styled.div<{ height: number }>`
  height: ${({ height }) => `${height}px`};
  min-height: ${({ height }) => `${height}px`};
  max-height: ${({ height }) => `${height}px`};
  width: 100%;
`;

const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
  max-width: 100vw;
  overflow: hidden;
`;

const Inner = styled.div`
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  max-width: 100%;
`;

const Menu: React.FC<React.PropsWithChildren<NavProps>> = ({
  linkComponent = "a",
  banner,
  rightSide,
  isDark,
  toggleTheme,
  currentLang,
  setLang,
  cakePriceUsd,
  links,
  homeLink: homeLink_,
  subLinks,
  footerLinks,
  activeItem,
  activeSubItem,
  activeSubItemChildItem,
  showCakePrice = true,
  showLangSelector = true,
  langs,
  buyCakeLabel,
  buyCakeLink,
  children,
  chainId,
  logoComponent,
}) => {
  const { isMobile } = useMatchBreakpoints();
  const isMounted = useIsMounted();
  const [showMenu, setShowMenu] = useState(true);
  const refPrevOffset = useRef(typeof window === "undefined" ? 0 : window.pageYOffset);

  const topBannerHeight = isMobile ? TOP_BANNER_HEIGHT_MOBILE : TOP_BANNER_HEIGHT;

  const totalTopMenuHeight = isMounted && banner ? MENU_HEIGHT + topBannerHeight : MENU_HEIGHT;

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset;
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight;
      const isTopOfPage = currentOffset === 0;
      // Always show the menu when user reach the top
      if (isTopOfPage) {
        setShowMenu(true);
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current || currentOffset <= totalTopMenuHeight) {
          // Has scroll up
          setShowMenu(true);
        }
      }
      refPrevOffset.current = currentOffset;
    };
    const throttledHandleScroll = throttle(handleScroll, 200);

    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [totalTopMenuHeight]);

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === "Home");

  const subLinksWithoutMobile = useMemo(() => subLinks?.filter((subLink) => !subLink.isMobileOnly), [subLinks]);
  const subLinksMobileOnly = useMemo(() => subLinks?.filter((subLink) => subLink.isMobileOnly), [subLinks]);
  const providerValue = useMemo(() => ({ linkComponent }), [linkComponent]);
  return (
    <MenuContext.Provider value={providerValue}>
      <HTMLWrapper>
        <Wrapper>
          <FixedContainer showMenu={showMenu} height={totalTopMenuHeight}>
            {banner && isMounted && <TopBannerContainer height={topBannerHeight}>{banner}</TopBannerContainer>}
            <StyledNav id="nav">
              <Flex>{logoComponent ?? <Logo href={homeLink_ ?? homeLink?.href ?? "/"} />}</Flex>
              <Flex alignItems="center" height="100%">
                <AtomBox display={{ xs: "none", lg: "block" }}>
                  <MenuItems
                    ml="24px"
                    items={links}
                    activeItem={activeItem}
                    activeSubItem={activeSubItem}
                    activeSubItemChildItem={activeSubItemChildItem}
                  />
                </AtomBox>
                {/* <AtomBox mr="12px" display={{ xs: "none", xxl: "block" }}>
                  <CakePrice chainId={chainId} showSkeleton={false} cakePriceUsd={cakePriceUsd} />
                </AtomBox>
                {showLangSelector && (
                  <Box mt="4px">
                    <LangSelector
                      currentLang={currentLang}
                      langs={langs}
                      setLang={setLang}
                      buttonScale="xs"
                      color="textSubtle"
                      hideLanguage
                    />
                  </Box>
                )} */}
                {rightSide}
              </Flex>
            </StyledNav>
          </FixedContainer>
          {subLinks ? (
            <Flex justifyContent="space-around" overflow="hidden">
              <SubMenuItems
                items={subLinksWithoutMobile}
                mt={`${totalTopMenuHeight + 1}px`}
                activeItem={activeSubItemChildItem || activeSubItem}
              />

              {subLinksMobileOnly && subLinksMobileOnly?.length > 0 && (
                <SubMenuItems
                  items={subLinksMobileOnly}
                  mt={`${totalTopMenuHeight + 1}px`}
                  activeItem={activeSubItemChildItem || activeSubItem}
                  isMobileOnly
                />
              )}
            </Flex>
          ) : (
            <div />
          )}
          <BodyWrapper mt={!subLinks ? `${totalTopMenuHeight + 1}px` : "0"}>
            <Inner>{children}</Inner>
          </BodyWrapper>
        </Wrapper>
        <Footer
          chainId={chainId}
          items={footerLinks}
          isDark={isDark}
          toggleTheme={toggleTheme}
          langs={langs}
          setLang={setLang}
          currentLang={currentLang}
          cakePriceUsd={cakePriceUsd}
          buyCakeLabel={buyCakeLabel}
          buyCakeLink={buyCakeLink}
          showLangSelector={showLangSelector}
          showCakePrice={showCakePrice}
        />
        <AtomBox display={{ xs: "block", lg: "none" }}>
          <BottomNav items={links} activeItem={activeItem} activeSubItem={activeSubItem} />
        </AtomBox>
      </HTMLWrapper>
    </MenuContext.Provider>
  );
};

export default Menu;
