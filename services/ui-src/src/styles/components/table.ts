import { ComponentStyleConfig, theme } from "@chakra-ui/react";

const baseStyles = {
  table: {
    th: {
      padding: "0.5rem 0",
      borderBottom: "1px solid",
      borderColor: "palette.gray_light",
      color: "palette.gray",
      fontWeight: "heading_sm_bold",
      textTransform: "none",
      letterSpacing: "normal",
      fontSize: "heading_sm",
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
    fontSize: "heading_sm",
    padding: "0.75rem 0.75rem 0.75rem 0",
    "&:first-of-type": {
      width: "65%",
      fontWeight: "heading_sm_bold",
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
    },
    td: {
      fontSize: "heading_sm",
      width: "50%",
      "p:first-of-type": {
        fontWeight: "heading_sm_bold",
        color: "palette.black",
      },
      "&:first-child": {
        "p:nth-child(2)": {
          color: "palette.gray_medium",
        },
      },
      "vertical-align": "top",
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
    fontSize: "body_sm",
    padding: "0",
    color: "black",
    width: "25%",
  },
};

const imaVariant = {
  table: {
    width: "100%",
    maxWidth: "685px",
    tableLayout: "fixed",
    marginTop: "1rem",
    boxShadow: "0 4px 4px -1px rgba(0, 0, 0, 0.25)",
    th: {
      padding: "0.45rem 0.5rem",
      backgroundColor: "palette.primary_darkest",
      color: "palette.white",
      fontSize: "body_sm",
      fontWeight: "heading_sm_bold",
      textAlign: "left",
      textTransform: "none",
      border: "none",
      "&:first-of-type": {
        width: "58%",
      },
      "&:nth-of-type(2)": {
        width: "13%",
        textAlign: "center",
      },
      "&:nth-of-type(3)": {
        width: "13%",
        textAlign: "center",
      },
      "&:last-of-type": {
        width: "16%",
        textAlign: "center",
      },
    },
    td: {
      padding: "16px",
      fontSize: "body_md",
      verticalAlign: "middle",
      border: "none",
      overflowWrap: "break-word",
      "&:first-of-type": {
        textAlign: "left",
      },
      "&:nth-of-type(n + 2)": {
        textAlign: "center",
      },
      ".ds-c-choice-wrapper": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      ".ima-user-created-row": {
        alignItems: "center",
        flexWrap: "nowrap",
        width: "100%",
        label: {
          flexShrink: 0,
          whiteSpace: "nowrap",
        },
        input: {
          minWidth: 0,
          flex: 1,
          borderWidth: "2px",
        },
      },
      ".ima-delete-button": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
        padding: 0,
      },
      label: {
        margin: "0.5rem 0",
        fontSize: "body_md",
        minWidth: "33%",
        "&:not([data-checked]) > span[aria-hidden='true']": {
          borderColor: "palette.base",
        },
        "&[data-checked] > span[aria-hidden='true']": {
          borderColor: "palette.primary",
        },
      },
    },
    tr: {
      border: "none",
      "&:nth-of-type(even)": {
        backgroundColor: "palette.gray_lightest_highlight",
      },
      "&:nth-of-type(odd)": {
        backgroundColor: "palette.white",
      },
    },
  },
};

const variants = {
  striped: stripedVariant,
  ima: imaVariant,
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
