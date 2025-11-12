import { ComponentStyleConfig } from "@chakra-ui/react";

const baseStyles = {
  textDecoration: "underline",
  transition: "all 0.3s ease",
};

const primaryVariant = {
  color: "palette.primary",
  _visited: {
    color: "palette.primary",
    textDecorationColor: "palette.primary",
  },
  ":hover, :visited:hover": {
    color: "palette.primary_darker",
    textDecorationColor: "palette.primary_darker",
  },
};
const returnVariant = {
  width: "fit-content",
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
    marginRight: "spacer1",
  },
};
const sidebarVariant = {
  display: "flex",
  alignItems: "center",
  width: "100%",
  textAlign: "left",
  textDecoration: "none",
  background: "transparent",
  color: "palette.base",
  fontWeight: "body_sm_link",
  border: "1px solid",
  borderRadius: "0",
  borderColor: "palette.gray_lighter",
  borderWidth: "0 0 1px 0",
  fontSize: "body_sm_link",
  lineHeight: "body_sm_link",
  paddingLeft: "1rem",
  height: "var(--chakra-sizes-10)",
  _visited: {
    color: "palette.base",
  },
  ":focus, :focus:visited": {
    color: "palette.secondary_darkest",
  },
  _hover: {
    color: "palette.secondary_darkest",
    backgroundColor: "palette.gray_lightest_highlight",
    border: "1px solid",
    borderColor: "palette.secondary",
    borderWidth: "0 0 0 4px",
    textDecoration: "none",
  },
  "&.selected": {
    backgroundColor: "palette.gray_lightest_highlight",
    border: "1px solid",
    borderColor: "palette.secondary",
    borderWidth: "0 0 0 2px",
    color: "palette.secondary_darkest",
  },
};
const inverseVariant = {
  color: "palette.white",
  _visited: {
    color: "palette.white",
    textDecorationColor: "palette.white",
  },
  ":hover, :visited:hover": {
    color: "palette.gray_lighter",
    textDecorationColor: "palette.gray_lighter",
  },
  ":active, :focus, :focus:visited": {
    color: "palette.white",
  },
};
const unstyledVariant = {
  textDecoration: "none",
  ":focus, :focus-visible, :hover, :visited, :visited:hover": {
    textDecoration: "none",
  },
};
const outlineButtonVariant = {
  color: "palette.primary",
  border: "1px solid",
  paddingY: "spacer1",
  paddingX: "spacer2",
  borderRadius: "5px",
  fontWeight: "bold",
  textDecoration: "none",
  _visited: { color: "palette.primary" },
  ":hover, :visited:hover": {
    color: "palette.primary_darker",
    textDecoration: "none",
  },
  ".mobile &": {
    border: "none",
  },
};

const variants = {
  primary: primaryVariant,
  return: returnVariant,
  sidebar: sidebarVariant,
  inverse: inverseVariant,
  unstyled: unstyledVariant,
  outlineButton: outlineButtonVariant,
};

const linkTheme: ComponentStyleConfig = {
  baseStyle: baseStyles,
  variants: variants,
  defaultProps: {
    variant: "primary",
  },
};

export default linkTheme;
