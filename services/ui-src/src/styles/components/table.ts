import { ComponentStyleConfig, theme } from "@chakra-ui/react";

const baseStyles = {
  table: {
    th: {
      padding: "0.5rem 0",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      color: "palette.gray",
      fontWeight: "bold",
      textTransform: "none",
      letterSpacing: "normal",
      fontSize: "sm",
    },
    tr: {
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
    },
    td: {
      paddingLeft: 0,
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      textAlign: "left",
      "&:last-of-type": {
        paddingRight: 0,
      },
    },
  },
};

const stripedVariant = () => ({
  ...theme.components.Table.variants!.striped,
  table: {
    maxWidth: "100%",
    "tr td:first-of-type": {
      width: "8rem",
      fontWeight: "semibold",
    },
    td: {
      padding: "0.5rem",
    },
    "td, tr": {
      border: "none",
    },
  },
});
const measureVariant = {
  th: {
    ".mobile &": {
      display: "none",
    },
  },
  td: {
    "&:first-of-type": {
      minWidth: "3rem",
      padding: "0 0.75rem",
    },
    "&:last-of-type": {
      minWidth: "4rem",
    },
    a: {
      whiteSpace: "nowrap",
      ".mobile &": {
        whiteSpace: "wrap",
      },
    },
    ".mobile &": {
      border: "none",
      paddingY: "0.5rem",
      "&:first-of-type": {
        display: "flex",
        paddingX: "0",
      },
    },
  },
  tr: {
    "th, td": {
      borderColor: "palette.gray_lighter",
    },
    ".mobile &": {
      display: "flex",
      flexFlow: "column",
      paddingY: "0.5rem",
    },
  },
};
const statusVariant = {
  td: {
    fontSize: "14px",
    padding: "0.75rem 0.75rem 0.75rem 0",
    "&:first-of-type": {
      width: "65%",
      fontWeight: "bold",
    },
    "&:nth-of-type(2)": {
      width: "25%",
      div: {
        display: "flex",
      },
    },
    ".mobile &": {
      border: "none",
      width: "100%",
      paddingY: "0.5rem",
    },
  },
  tr: {
    ".mobile &": {
      display: "grid",
      gridTemplateColumns: "50% 50%",
      paddingY: "0.5rem",
    },
  },
  th: {
    ".mobile &": {
      "&:last-of-type": {
        display: "none",
      },
      padding: "0",
    },
    "tr &": {
      border: "none",
    },
  },
};

const exportVariant = {
  table: {
    "th, td": {
      borderColor: "palette.gray_lighter",
      padding: ".5rem",
      "&:first-child": {
        padding: ".5rem .5rem .5rem 0",
      },
    },
    td: {
      fontSize: "14px",
      width: "50%",
      "p:first-of-type": {
        fontWeight: "bold",
        color: "palette.black",
      },
      "&:first-child": {
        "p:nth-child(2)": {
          color: "palette.gray_medium",
        },
      },
    },
  },
};

const reportDetailsVariant = {
  tr: {
    "th, td": {
      borderColor: "transparent",
    },
  },
  td: {
    fontSize: "14px",
    padding: "0",
    color: "black",
  },
};

const variants = {
  striped: stripedVariant,
  measure: measureVariant,
  status: statusVariant,
  export: exportVariant,
  reportDetails: reportDetailsVariant,
};

const sizes = {};

const tableTheme: ComponentStyleConfig = {
  baseStyle: baseStyles,
  sizes: sizes,
  variants: variants,
};

export default tableTheme;
