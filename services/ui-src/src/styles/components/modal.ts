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
  },
  header: {
    paddingX: "0",
    paddingTop: "0",
    paddingBottom: "spacer2",
    fontWeight: "bold"
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

const modalTheme: ComponentStyleConfig = {
  baseStyle: baseStyles,
};

export default modalTheme;
