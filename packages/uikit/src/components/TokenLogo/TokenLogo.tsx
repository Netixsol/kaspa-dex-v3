import { useState } from "react";
import { HelpFilledIcon, HelpIcon } from "../Svg";

const BAD_SRCS: { [imageSrc: string]: true } = {};

export interface TokenLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  srcs: string[];
  useFilledIcon?: boolean;
}

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
const TokenLogo: React.FC<React.PropsWithChildren<TokenLogoProps>> = ({ srcs, useFilledIcon, alt, ...rest }) => {
  const [, refresh] = useState<number>(0);

  const src: string | undefined = srcs.find((s) => !BAD_SRCS[s]);

  if (src) {
    return (
      <img
        {...rest}
        alt={alt}
        src={src}
        onError={() => {
          // eslint-disable-next-line no-param-reassign
          if (src) BAD_SRCS[src] = true;
           const tokenAddress = src.match(/0x[a-fA-F0-9]{40}/)?.[0];
          if (tokenAddress && !src.includes("/images/tokens/")) {
            // console.log({tokenAddress})
            const fallbackSrcs = [
              `/images/chains/${tokenAddress.toLowerCase()}.png`,
              `/images/chains/${tokenAddress.toUpperCase()}.png`,
              // `/TokenLogos/default.png`, // Final fallback
            ];
            srcs.push(...fallbackSrcs);
          }
          refresh((i) => i + 1);
        }}
      />
    );
  }

  return useFilledIcon ? <HelpFilledIcon color="textSubtle" {...rest} /> : <HelpIcon {...rest} />;
};

export default TokenLogo;
