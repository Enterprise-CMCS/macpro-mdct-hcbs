import { ComponentStyleConfig } from "@chakra-ui/react";

const baseStyles = {
  color: "palette.base",
  fontWeight: "normal",
  margin: "0",
};

const h1Variant = {
  fontSize: "4xl",
  fontWeight: "normal",
  ".mobile &": {
    fontSize: "2xl",
  },
  display: "inline-block",
};

const subHeaderVariant = {
  fontSize: "21px",
  fontWeight: "700",
  p: {
    margin: "0",
  },
  ".mobile &": {
    fontSize: "lg",
  },
};

const nestedHeadingVariant = {
  fontSize: "18px",
  fontWeight: "700",
  p: {
    margin: "0",
  },
  ".mobile &": {
    fontSize: "lg",
  },
};

const sidebarVariant = {
  fontSize: "21px",
  fontWeight: "700",
  padding: "2rem",
  margin: "0",
};

const loginVariant = {
  my: "6rem",
  textAlign: "center",
  width: "100%",
};

const variants = {
  h1: h1Variant,
  subHeader: subHeaderVariant,
  nestedHeading: nestedHeadingVariant,
  sidebar: sidebarVariant,
  login: loginVariant,
};

const headingTheme: ComponentStyleConfig = {
  baseStyle: baseStyles,
  variants: variants,
  defaultProps: {
    variant: "primary",
    size: "md",
  },
};

export default headingTheme;
