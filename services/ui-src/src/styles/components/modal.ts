import { ComponentStyleConfig } from "@chakra-ui/react";

const baseStyles = {
  dialog: {
    minWidth: "500px",
    padding: "2rem",
    ".close": {
      position: "absolute",
      right: "2rem",
    },
    borderRadius: "none",
  },
  header: {
    padding: "0 0 1.50rem 0",
  },
  body: {
    padding: "0 0 2rem 0",
  },
  footer: {
    display: "block",
    padding: "0",
    "button:first-of-type": {
      marginRight: "2.5rem",
    },
  },
  closeButton: {
    padding: "2rem",
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
