import { ComponentStyleConfig } from "@chakra-ui/react";

const baseStyles = {
  color: "palette.base",
  transition: "all 0.3s ease",
  ".mobile &": {
    fontSize: ".95rem",
  },
};

const tableEmptyVariant = {
  maxWidth: "75%",
  margin: "0 auto",
  textAlign: "center",
};
const helperTextVariant = {
  color: "palette.gray_medium_dark",
};
const errorVariant = {
  color: "palette.error",
  fontSize: "12px",
  marginTop: "4px",
};
const greyVariant = {
  color: "palette.gray",
  fontWeight: "bold",
  textTransform: "none",
  letterSpacing: "normal",
  fontSize: "sm",
};

const variants = {
  tableEmpty: tableEmptyVariant,
  helperText: helperTextVariant,
  error: errorVariant,
  grey: greyVariant,
};

const textTheme: ComponentStyleConfig = {
  baseStyle: baseStyles,
  variants: variants,
};

export default textTheme;
