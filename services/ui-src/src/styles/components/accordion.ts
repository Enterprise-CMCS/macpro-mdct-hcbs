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
    a: {
      color: "palette.primary",
      textDecoration: "underline",
    },
    header: {
      marginBottom: "spacer3",
    },
    p: {
      marginBottom: "spacer3",
    },
    ul: {
      marginBottom: "spacer3",
    },
  },
  container: {
    borderStyle: "none",
  },
};

const accordionTheme: ComponentStyleConfig = {
  baseStyle: baseStyles,
};

export default accordionTheme;
