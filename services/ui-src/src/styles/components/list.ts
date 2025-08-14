import { ComponentStyleConfig } from "@chakra-ui/react";

const baseStyles = {
  container: {},
};

const accordionVariant = {
  container: {
    paddingLeft: "1rem",
  },
};

const variants = {
  accordion: accordionVariant,
};

const listTheme: ComponentStyleConfig = {
  baseStyle: baseStyles,
  variants: variants,
};

export default listTheme;
