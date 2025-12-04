import { ComponentStyleConfig } from "@chakra-ui/react";
import { svgFilters } from "styles/foundations/filters";
import theme from "styles/theme";

const baseStyles = {
  transition: "all 0.3s ease",
  ".mobile &": {
    fontSize: "body_sm",
  },
  borderRadius: "0.25rem",
  fontWeight: "body_sm",
  paddingX: "spacer3",
};

const primaryVariant = {
  width: "fit-content",
  fontWeight: "bold",
  backgroundColor: "palette.primary",
  color: "palette.white",
  "&:hover, &:focus, &:focus:visited": {
    backgroundColor: "palette.primary_darker",
    color: "palette.white",
  },
  "&:disabled, &:disabled:hover": {
    color: "palette.gray_dark",
    backgroundColor: "palette.gray_lighter",
    opacity: 1,
  },
  _visited: {
    color: "palette.white",
  },
  ".icon": {
    marginRight: "spacer1",
  },
};
const transparentVariant = {
    color: "palette.primary",
    backgroundColor: "transparent",
    _hover: {
      color: "palette.primary_darker",
      backgroundColor: "transparent",
      span: {
        filter: svgFilters.primary_darker,
      },
    },
  },
  sidebarToggleVariant = {
    position: "absolute",
    background: "palette.gray_lightest",
    borderRadius: "0px 10px 10px 0px",
    "img.left": {
      transform: "rotate(90deg)",
    },
    "img.right": {
      transform: "rotate(270deg)",
    },
    right: "-48px",
  };
const outlineVariant = () => ({
  ...theme.components.Button.variants.transparent,
  border: "1px solid",
  borderColor: "palette.primary",
  textDecoration: "none",
  fontWeight: "bold",
  "&:disabled, &:disabled:hover": {
    color: "palette.gray_dark",
    borderColor: "palette.gray_dark",
  },
  _hover: {
    ...theme.components.Button.variants.transparent._hover,
    borderColor: "palette.primary_darker",
    span: {
      filter: svgFilters.primary_darker,
    },
  },
  _visited: {
    color: "palette.primary",
  },
  ":hover, :visited:hover": {
    color: "palette.primary_darker",
  },
  _focus: {
    textDecoration: "none",
  },
});
const linkVariant = () => ({
  ...theme.components.Button.variants.transparent,
  textDecoration: "underline",
});
// inverse variants
const inverseVariant = {
  backgroundColor: "palette.white",
  color: "palette.primary",
  _hover: {
    color: "palette.primary_darker",
    span: {
      filter: svgFilters.primary_darker,
    },
  },
};
const inverse_transparentVariant = {
  color: "palette.white",
  backgroundColor: "transparent",
  span: {
    filter: svgFilters.white,
  },
  _hover: {
    color: "palette.gray_lighter",
    backgroundColor: "transparent",
    span: {
      filter: svgFilters.gray_lighter,
    },
  },
};
const inverse_outlineVariant = () => ({
  ...theme.components.Button.variants.inverse_transparent,
  border: "1px solid",
  borderColor: "palette.white",
  span: {
    filter: svgFilters.white,
  },
  _hover: {
    ...theme.components.Button.variants.transparent._hover,
    borderColor: "palette.gray_lighter",
    span: {
      filter: svgFilters.gray_lighter,
    },
  },
});
const inverse_linkVariant = () => ({
  ...theme.components.Button.variants.inverse_transparent,
  textDecoration: "underline",
});
// other
const dangerVariant = {
  backgroundColor: "palette.error_dark",
  color: "palette.white",
  _hover: {
    backgroundColor: "palette.error_darker",
  },
};
const returnVariant = {
  color: "palette.primary",
  width: "fit-content",
  padding: "0",
  textDecoration: "none",
  _hover: {
    textDecoration: "underline",
  },
  _visited: {
    color: "palette.primary",
  },
  display: "flex",
  ".icon": {
    width: "1.25rem",
    height: "1.25rem",
    marginTop: "0.15rem",
    marginRight: "0.5rem",
  },
};

const variants = {
  primary: primaryVariant,
  transparent: transparentVariant,
  sidebarToggle: sidebarToggleVariant,
  outline: outlineVariant,
  link: linkVariant,
  inverse: inverseVariant,
  inverse_transparent: inverse_transparentVariant,
  inverse_outline: inverse_outlineVariant,
  inverse_link: inverse_linkVariant,
  danger: dangerVariant,
  return: returnVariant,
};

const buttonTheme: ComponentStyleConfig = {
  baseStyle: baseStyles,
  variants: variants,
  defaultProps: {
    variant: "primary",
  },
};

export default buttonTheme;
