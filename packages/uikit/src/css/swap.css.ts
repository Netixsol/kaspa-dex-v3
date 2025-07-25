import { style } from "@vanilla-extract/css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { atoms } from "./atoms";
import { responsiveStyle } from "./responsiveStyle";
import { vars } from "./vars.css";

export const inputVariants = recipe({
  base: {
    width: 0,
    position: "relative",
    fontWeight: 500,
    outline: "none",
    border: "none",
    flex: "1 1 auto",
    backgroundColor: "transparent",
    fontSize: 16,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: 0,
    WebkitAppearance: "textfield",
    color: vars.colors.text,
    selectors: {
      "&::-webkit-search-decoration": {
        WebkitAppearance: "none",
      },
      '&[type="number"]': {
        MozAppearance: "textfield",
      },
      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
        WebkitAppearance: "none",
      },
      "&::placeholder": {
        color: vars.colors.textSubtle,
      },
    },
  },
  variants: {
    error: {
      true: {
        color: vars.colors.failure,
      },
    },
    loading: {
      true: {
        color: vars.colors.textDisabled,
      },
    },
    align: {
      left: {
        textAlign: "left",
      },
      center: {
        textAlign: "center",
      },
      right: {
        textAlign: "right",
      },
    },
  },
  defaultVariants: {
    align: "right",
    error: false,
  },
});

export type InputVariants = RecipeVariants<typeof inputVariants>;

export const inputContainerVariants = recipe({
  base: style([
    atoms({
      borderRadius: "default",
      backgroundColor: "input",
    }),
    style({
      selectors: {
        "&:focus-within": {
          boxShadow: vars.shadows.focus,
        },
      },
    }),
  ]),
  variants: {
    error: {
      true: style({
        selectors: {
          "&:focus-within": {
            boxShadow: vars.shadows.danger,
          },
        },
      }),
      false: atoms({
        boxShadow: "inset",
      }),
    },
    showBridgeWarning: {
      true: atoms({
        boxShadow: "warning",
      }),
    },
  },
});

export const pageVariants = recipe({
  base: style([
    atoms({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      height: "100%",
      background: "backgroundBubblegum",
      padding: "16px",
      paddingBottom: "0px",
    }),
    style({
      backgroundSize: "auto",
    }),
    responsiveStyle({
      sm: {
        padding: "24px",
        paddingBottom: "0px",
      },
      lg: {
        padding: "32px",
        paddingBottom: "0px",
      },
    }),
  ]),
  variants: {
    removePadding: {
      true: {
        padding: "0!important",
      },
    },
    noMinHeight: {
      true: responsiveStyle({
        xs: {
          minHeight: "initial!important",
        },
      }),
    },
  },
});

export type PageVariants = RecipeVariants<typeof pageVariants>;

export const iconButtonClass = style([
  atoms({
    borderRadius: "circle",
    cursor: "pointer",
    color: "text",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),
  style({
    padding: "0.2rem",
    fontSize: "0.875rem",
    border: "none",
    height: "22px",
    width: "22px",
    fontWeight: 400,
    marginLeft: "0.4rem",
    float: "right",
  }),
]);
