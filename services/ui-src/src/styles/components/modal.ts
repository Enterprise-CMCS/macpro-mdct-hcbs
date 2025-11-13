import { ComponentStyleConfig } from "@chakra-ui/react";

const baseStyles = {
  dialog: {
    minWidth: "500px",
    ".close": {
      position: "absolute",
      right: "spacer4",
    },
    borderRadius: "none",
    padding: "spacer4",
    boxShadow: ".125rem .125rem .25rem",
  },
  header: {
    paddingX: "0",
    paddingTop: "0",
    paddingBottom: "spacer2",
    fontWeight: "bold",
  },
  body: {
    paddingX: "0",
    paddingTop: "0",
    paddingBottom: "spacer3",
  },
  footer: {
    display: "block",
    padding: "0",
    "button:first-of-type": {
      marginRight: "spacer3",
    },
  },
};

const sizes = {
  sm: {
    dialog: {
      minWidth: "400px",
    },
  },
};

const modalTheme: ComponentStyleConfig = {
  baseStyle: baseStyles,
  sizes: sizes,
};

export default modalTheme;
