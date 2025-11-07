import { ComponentStyleConfig } from "@chakra-ui/react";

const baseStyles = {
  borderStyle: "none",
  root: {
    width: "100%",
  },
  button: {
    background: "palette.gray_lightest",
    padding: "0 1.5rem",
  },
  panel: {
    width: "100%",
    table: {
      "tr td:last-of-type": {
        fontWeight: "semibold",
      },
    },
    p: {
      marginBottom: "1rem",
    },
  },
};

const accordionTheme: ComponentStyleConfig = {
  baseStyle: baseStyles,
};

export default accordionTheme;
