// import { isMobile, isTablet } from "react-device-detect";
import { useIsMounted } from "@pancakeswap/hooks";
import React from "react";
import { useMatchBreakpoints } from "../../contexts";
import { Box, Flex } from "../Box";
// import { Link } from "../Link";
// import {
//   StyledFooter,
//   StyledIconMobileContainer,
//   StyledList,
//   StyledListItem,
//   StyledSocialLinks,
//   StyledText,
//   StyledToolsContainer,
// } from "./styles";

// import { vars } from "../../css/vars.css";
// import { Button } from "../Button";
// import CakePrice from "../CakePrice/CakePrice";
// import LangSelector from "../LangSelector/LangSelector";
import { ArrowForwardIcon, LogoIcon, LogoWithTextIcon } from "../Svg";
import { FooterProps } from "./types";
import { Text } from "../Text";
import { StyledFooter, StyledSocialLinks } from "./styles";

const MenuItem: React.FC<React.PropsWithChildren<FooterProps>> = ({
  items,
  isDark,
  toggleTheme,
  currentLang,
  langs,
  setLang,
  cakePriceUsd,
  buyCakeLabel,
  buyCakeLink,
  chainId,
  showLangSelector = true,
  showCakePrice = true,
  ...props
}) => {
  const isMounted = useIsMounted();
  const { isXl } = useMatchBreakpoints();

  return (
    <StyledFooter
      data-theme="dark"
      p={["16px 23px", null, "16px 23px"]}
      position="relative"
      {...props}
      justifyContent="center"
    >
      <Flex
        flexDirection={["column", null, null, "row"]}
        justifyContent="space-between"
        width={["100%", null, "1200px"]}
      >
        {/* Powered By Text and Logo Start */}
        <Flex
          alignItems="center"
          flexDirection={["column", null, "row"]}
          justifyContent={["center", null, null, "start"]}
        >
          <Text fontSize="15px" color="#2EFE87">
            Powered By
          </Text>
          <Box borderRight="1px solid #fff" height="100%" mx={["0", null, "20px"]} mt={["8px", null, "0"]} />
          <Box>
            <LogoWithTextIcon width="200px" />
          </Box>
        </Flex>
        {/* Powered By Text and Logo End */}

        {/* Socials Start */}
        <Flex justifyContent={["center", null, null, "end"]} mt={["20px", null, null, "0px"]}>
          <StyledSocialLinks order={[2]} />
        </Flex>
        {/* Socials End */}
      </Flex>
    </StyledFooter>
  );

  // ---------- Previous Code ----------
  // return (
  //   <StyledFooter
  //     data-theme="dark"
  //     p={["40px 16px", null, "56px 40px 32px 40px"]}
  //     position="relative"
  //     {...props}
  //     justifyContent="center"
  //   >
  //     <Flex flexDirection="column" width={["100%", null, "1200px;"]}>
  //       <StyledIconMobileContainer display={["block", null, "none"]}>
  //         <LogoWithTextIcon width="130px" />
  //       </StyledIconMobileContainer>
  //       <Flex
  //         order={[2, null, 1]}
  //         flexDirection={["column", "column", "column", "column", "row", "row"]}
  //         justifyContent="space-between"
  //         alignItems="flex-start"
  //         mb={["42px", null, "36px"]}
  //       >
  //         {items?.map((item) => (
  //           <StyledList key={item.label}>
  //             <StyledListItem>{item.label}</StyledListItem>
  //             {item.items?.map(({ label, href, isHighlighted = false }) => (
  //               <StyledListItem key={label}>
  //                 {href ? (
  //                   <Link
  //                     data-theme="dark"
  //                     href={href}
  //                     external
  //                     color={isHighlighted ? vars.colors.warning : "text"}
  //                     bold={false}
  //                     style={{ textTransform: "none" }}
  //                   >
  //                     {label}
  //                   </Link>
  //                 ) : (
  //                   <StyledText>{label}</StyledText>
  //                 )}
  //               </StyledListItem>
  //             ))}
  //           </StyledList>
  //         ))}
  //         <Box display={["none", null, "block"]}>{isXl ? <LogoIcon /> : <LogoWithTextIcon width="160px" />}</Box>
  //       </Flex>
  //       <StyledSocialLinks order={[2]} pb={["42px", null, "32px"]} mb={["0", null, "32px"]} />
  //       <StyledToolsContainer
  //         data-theme="dark"
  //         order={[1, null, 3]}
  //         flexDirection={["column", null, "row"]}
  //         justifyContent="space-between"
  //       >
  //         <Flex order={[2, null, 1]} alignItems="center">
  //           {/* {isMounted && <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} />} */}
  //           {showLangSelector && (
  //             <LangSelector
  //               currentLang={currentLang}
  //               langs={langs}
  //               setLang={setLang}
  //               color="textSubtle"
  //               dropdownPosition="top-right"
  //             />
  //           )}
  //         </Flex>
  //         {showCakePrice && (
  //           <Flex order={[1, null, 2]} mb={["24px", null, "0"]} justifyContent="space-between" alignItems="center">
  //             <Box mr="20px">
  //               <CakePrice chainId={chainId} cakePriceUsd={cakePriceUsd} color="textSubtle" />
  //             </Box>
  //             <Button
  //               data-theme="dark"
  //               as="a"
  //               href={buyCakeLink}
  //               target="_blank"
  //               scale="sm"
  //               endIcon={<ArrowForwardIcon color="backgroundAlt" />}
  //             >
  //               {buyCakeLabel}
  //             </Button>
  //           </Flex>
  //         )}
  //       </StyledToolsContainer>
  //     </Flex>
  //   </StyledFooter>
  // );
};

export default MenuItem;
