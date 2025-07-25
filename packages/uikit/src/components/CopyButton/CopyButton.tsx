import { ElementType, useState } from "react";
import { copyText } from "./copyText";
import { CopyIcon, SvgProps } from "../Svg";
import styled from "styled-components";
import { IconButton } from "../Button";



export const Tooltip = styled.div<{
  isTooltipDisplayed: boolean;
  tooltipTop: number;
  tooltipRight?: number;
  disabled?: boolean;
  tooltipFontSize?: number;
}>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? "inline" : "none")};
  position: absolute;
  padding: 8px;
  top: ${({ tooltipTop }) => `${tooltipTop}px`};
  right: ${({ tooltipRight }) => (tooltipRight ? `${tooltipRight}px` : 0)};
  text-align: center;
  font-size: ${({ tooltipFontSize }) => `${tooltipFontSize}px` ?? "100%"};
  background: #ffff;
  color: #2f3678;
  border-radius: 16px;
  z-index: 100;
  /* opacity: 0.7; */
  width: max-content;
`;
interface CopyButtonProps extends SvgProps {
  text: string;
  tooltipMessage: string;
  tooltipTop: number;
  tooltipRight?: number;
  tooltipFontSize?: number;
  buttonColor?: string;
  disabled?: boolean;
}

export const CopyButton: React.FC<React.PropsWithChildren<CopyButtonProps>> = ({
  text,
  tooltipMessage,
  width,
  tooltipTop,
  tooltipRight,
  tooltipFontSize,
  buttonColor = "primary",
  disabled,
  ...props
}) => {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

  const displayTooltip = () => {
    setIsTooltipDisplayed(true);
    setTimeout(() => {
      setIsTooltipDisplayed(false);
    }, 1000);
  };

  const handleClick = () => {
    if (!disabled) {
      copyText(text, displayTooltip);
    }
    // stopPropgation();
  };

  const stopPropgation = (e: any) => {
    e.stopPropagation();
    if (!disabled) {
      copyText(text, displayTooltip);
    }
  };

  return (
    <>
      <CopyIcon
        style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}
        color={buttonColor}
        width={width}
        onClick={stopPropgation}
        {...props}
      />
      <Tooltip
        isTooltipDisplayed={isTooltipDisplayed}
        tooltipTop={tooltipTop}
        tooltipRight={tooltipRight}
        tooltipFontSize={tooltipFontSize}
      >
        {tooltipMessage}
      </Tooltip>
    </>
  );
};
