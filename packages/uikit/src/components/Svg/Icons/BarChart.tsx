import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 16 16" {...props}>
      <g clipPath={`url(#clip0_316_14299${props?.id ?? ""})`}>
        <path d="M4.26668 6.13301H4.40001C4.91334 6.13301 5.33334 6.55301 5.33334 7.06634V11.733C5.33334 12.2463 4.91334 12.6663 4.40001 12.6663H4.26668C3.75334 12.6663 3.33334 12.2463 3.33334 11.733V7.06634C3.33334 6.55301 3.75334 6.13301 4.26668 6.13301ZM8.00001 3.33301C8.51334 3.33301 8.93334 3.75301 8.93334 4.26634V11.733C8.93334 12.2463 8.51334 12.6663 8.00001 12.6663C7.48668 12.6663 7.06668 12.2463 7.06668 11.733V4.26634C7.06668 3.75301 7.48668 3.33301 8.00001 3.33301ZM11.7333 8.66634C12.2467 8.66634 12.6667 9.08634 12.6667 9.59967V11.733C12.6667 12.2463 12.2467 12.6663 11.7333 12.6663C11.22 12.6663 10.8 12.2463 10.8 11.733V9.59967C10.8 9.08634 11.22 8.66634 11.7333 8.66634Z" />
      </g>
      <defs>
        <clipPath id={`clip0_316_14299${props?.id ?? ""}`}>
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </Svg>
  );
};

export default Icon;
