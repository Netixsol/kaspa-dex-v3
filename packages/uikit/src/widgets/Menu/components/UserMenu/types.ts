import { Placement } from "@popperjs/core";
import { ReactNode } from "react";
import { FlexProps } from "../../../../components/Box";

export const variants = {
  DEFAULT: "default",
  WARNING: "warning",
  DANGER: "danger",
  PENDING: "pending",
} as const;

export type Variant = (typeof variants)[keyof typeof variants];

export interface UserMenuProps extends Omit<FlexProps, "children"> {
  account?: string;
  text?: ReactNode;
  avatarSrc?: string;
  fallbackSrc?: string;
  avatarClassName?: string;
  variant?: Variant;
  disabled?: boolean;
  children?: (exposedProps: { isOpen: boolean }) => ReactNode;
  placement?: Placement;
  recalculatePopover?: boolean;
  ellipsis?: boolean;
  popperStyle?: React.CSSProperties;
}

export interface UserMenuItemProps {
  disabled?: boolean;
}
