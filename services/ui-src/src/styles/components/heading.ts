import { ComponentStyleConfig } from "@chakra-ui/react";

const baseStyles = {
  color: "palette.base",
  fontWeight: "normal",
  margin: "0",
};

const h1Variant = {
  fontSize: "heading_3xl",
  fontWeight: "heading_3xl",
  ".mobile &": {
    fontSize: "heading_2xl",
  },
  display: "inline-block",
};

const subHeaderVariant = {
  fontSize: "heading_xl",
  fontWeight: "heading_xl",
  p: {
    margin: "0",
  },
  ".mobile &": {
    fontSize: "heading_lg",
  },
};

const nestedHeadingVariant = {
  fontSize: "heading_lg",
  fontWeight: "heading_lg",
  p: {
    margin: "0",
  },
  ".mobile &": {
    fontSize: "heading_lg",
  },
};

const sidebarVariant = {
  fontSize: "heading_xl",
  fontWeight: "heading_xl",
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
    fontSize: "heading_md",
  },
};

export default headingTheme;
