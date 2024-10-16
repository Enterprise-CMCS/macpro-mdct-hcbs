// Chakra UI theme info: https://chakra-ui.com/docs/styled-system/theming/theme
import { extendTheme } from "@chakra-ui/react";

export const svgFilters = {
  primary:
    "brightness(0) saturate(100%) invert(30%) sepia(93%) saturate(1282%) hue-rotate(181deg) brightness(91%) contrast(101%)",
  primary_darker:
    "brightness(0) saturate(100%) invert(19%) sepia(43%) saturate(3547%) hue-rotate(185deg) brightness(97%) contrast(101%)",
  white:
    "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(7500%) hue-rotate(142deg) brightness(115%) contrast(115%);",
  gray_lighter:
    "brightness(0) saturate(100%) invert(91%) sepia(0%) saturate(89%) hue-rotate(162deg) brightness(97%) contrast(93%);",
};

const theme = extendTheme({
  sizes: {
    appMax: "100vw",
    basicPageWidth: "46rem",
    reportPageWidth: "46rem",
    // font sizes: https://design.cms.gov/utilities/font-size/
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    md: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.3125rem", // 21px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },
  breakpoints: {
    // read this: https://bit.ly/3xSWnDt
    base: "0em", // mobile (<=35em|560px)
    sm: "35em", // tablet (>35em|560px and <=55em|880px)
    md: "55em", // desktop, small (>55em|880px and <=75em|1200px)
    lg: "75em", // desktop, large (>75em|1200px and <=100em|1600px)
    xl: "100em", // desktop, ultrawide (>100em|1600px)
  },
  fonts: {
    heading: "Open Sans",
    body: "Open Sans",
  },
  lineHeights: {
    // https://design.cms.gov/utilities/line-height/
    normal: "normal",
    reset: 1,
    heading: 1.3,
    base: 1.5,
    lead: 1.7,
  },
  colors: {
    palette: {
      // primary
      primary: "#0071bc",
      primary_darker: "#004f84",
      primary_darkest: "#00395e",
      // secondary
      secondary_lightest: "#e6f9fd",
      secondary_lighter: "#b3ecf8",
      secondary_light: "#4ed2ee",
      secondary: "#02bfe7",
      secondary_dark: "#02acd0",
      secondary_darker: "#0186a2",
      secondary_darkest: "#016074",
      // status: success
      success_lightest: "#e7f3e7",
      success_lighter: "#89c487",
      success_light: "#2a9526",
      success: "#12890e",
      success_dark: "#107b0d",
      success_darker: "#0d600a",
      success_darkest: "#094507",
      // status: warn
      warn_lightest: "#fef9e9",
      warn_lighter: "#fce28f",
      warn_light: "#f9ca35",
      warn: "#f8c41f",
      warn_dark: "#dfb01c",
      warn_darker: "#ae8916",
      warn_darkest: "#7c6210",
      // status: error
      error_lightest: "#fce8ec",
      error_lighter: "#f7bbc5",
      error_light: "#f18e9e",
      error: "#e31c3d",
      error_dark: "#cc1937",
      error_darker: "#9f142b",
      error_darkest: "#720e1f",
      // neutrals
      white: "#ffffff",
      gray_lightest: "#f2f2f2",
      gray_lighter: "#d9d9d9",
      gray_light: "#a6a6a6",
      gray: "#5a5a5a",
      gray_dark: "#404040",
      base: "#262626",
      black: "#000000",
      // other
      focus_light: "#ffffff",
      focus_dark: "#bd13b8",
      muted: "#e9ecf1",
      // custom
      gray_lightest_highlight: "#f8f8f8",
      gray_medium: "#71767a",
      gray_medium_dark: "#5B616B",
      spreadsheet: "#1d6f42",
      spreadsheet_dark: "#174320",
    },
  },
  components: {
    Accordion: {
      baseStyle: {
        borderStyle: "none",
        button: {
          marginTop: "2rem",
          background: "palette.gray_lightest",
          padding: "0 1.5rem",
        },
        panel: {
          table: {
            "tr td:last-of-type": {
              fontWeight: "semibold",
            },
          },
          p: {
            marginBottom: "1rem",
          },
          list: {
            paddingLeft: "1rem",
          },
        },
      },
    },
    Button: {
      baseStyle: {
        transition: "all 0.3s ease",
        ".mobile &": {
          fontSize: "sm",
        },
        borderRadius: "0",
        fontWeight:"normal"
      },
      variants: {
        // primary variants
        primary: {
          borderRadius: "0.25rem",
          width: "fit-content",
          fontWeight: "bold",
          backgroundColor: "palette.primary",
          color: "palette.white",
          "&:hover": {
            backgroundColor: "palette.primary_darker",
          },
          "&:disabled, &:disabled:hover": {
            color: "palette.gray",
            backgroundColor: "palette.gray_lighter",
          },
        },
        transparent: {
          color: "palette.primary",
          backgroundColor: "transparent",
          _hover: {
            color: "palette.primary_darker",
            backgroundColor: "transparent",
            span: {
              filter: svgFilters.primary_darker,
            },
          },
        },
        sidebar: {
          display: "block",
          width: "100%",
          textAlign: "left",
          background: "transparent",
          color: "palette.base",
          fontWeight: "normal",
          border: "1px solid",
          borderRadius: "0",
          borderColor: "palette.gray_lighter",
          borderWidth: "0 0 1px 0",
          fontSize: "14px",
          paddingLeft: "2rem",
          _hover: {
            color: "palette.secondary_darkest",
            backgroundColor: "palette.gray_lightest_highlight",
            border: "1px solid",
            borderColor: "palette.secondary",
            borderWidth: "0 0 0 4px",
          },
        },
        sidebarSelected: {
          display:"block",
          textAlign: "left",
          color: "palette.secondary_darkest",
          backgroundColor: "palette.gray_lightest_highlight",
          border: "1px solid",
          borderColor: "palette.secondary",
          borderWidth: "0 0 0 4px",
          fontSize: "14px",
          paddingLeft: "2rem",
          width:"100%"
        },
        sidebarToggle: {
          padding: "0",
          background: "palette.gray_lightest",
          borderRadius: "0px 10px 10px 0px",
          "img.left": {
            transform: "rotate(90deg)",
          },
          "img.right": {
            transform: "rotate(270deg)",
          },
        },
        outline: () => ({
          ...theme.components.Button.variants.transparent,
          border: "1px solid",
          borderColor: "palette.primary",
          textDecoration: "none",
          "&:disabled, &:disabled:hover": {
            color: "palette.gray",
            borderColor: "palette.gray",
          },
          _hover: {
            ...theme.components.Button.variants.transparent._hover,
            borderColor: "palette.primary_darker",
            span: {
              filter: svgFilters.primary_darker,
            },
          },
          _visited: {
            color: "palette.primary",
          },
          ":hover, :visited:hover": {
            color: "palette.primary_darker",
          },
          _focus: {
            textDecoration: "none",
          },
        }),
        link: () => ({
          ...theme.components.Button.variants.transparent,
          textDecoration: "underline",
        }),
        // inverse variants
        inverse: {
          backgroundColor: "palette.white",
          color: "palette.primary",
          _hover: {
            color: "palette.primary_darker",
            span: {
              filter: svgFilters.primary_darker,
            },
          },
        },
        inverse_transparent: {
          color: "palette.white",
          backgroundColor: "transparent",
          span: {
            filter: svgFilters.white,
          },
          _hover: {
            color: "palette.gray_lighter",
            backgroundColor: "transparent",
            span: {
              filter: svgFilters.gray_lighter,
            },
          },
        },
        inverse_outline: () => ({
          ...theme.components.Button.variants.inverse_transparent,
          border: "1px solid",
          borderColor: "palette.white",
          span: {
            filter: svgFilters.white,
          },
          _hover: {
            ...theme.components.Button.variants.transparent._hover,
            borderColor: "palette.gray_lighter",
            span: {
              filter: svgFilters.gray_lighter,
            },
          },
        }),
        inverse_link: () => ({
          ...theme.components.Button.variants.inverse_transparent,
          textDecoration: "underline",
        }),
        // other
        danger: {
          backgroundColor: "palette.error_dark",
          color: "palette.white",
          _hover: {
            backgroundColor: "palette.error_darker",
          },
        },
      },
      defaultProps: {
        variant: "primary",
      },
    },
    Heading: {
      baseStyle: {
        color: "palette.base",
        fontWeight: "normal",
        marginBottom: "1rem",
      },
      variants: {
        h1: {
          fontSize: "2rem",
        },
        sidebar: {
          fontSize: "21px",
          fontWeight: "700",
          padding: "32px",
          margin: "0",
        },
      },
    },
    Link: {
      baseStyle: {
        textDecoration: "underline",
        transition: "all 0.3s ease",
      },
      variants: {
        primary: {
          color: "palette.primary",
          _visited: {
            color: "palette.primary",
            textDecorationColor: "palette.primary",
          },
          ":hover, :visited:hover": {
            color: "palette.primary_darker",
            textDecorationColor: "palette.primary_darker",
          },
        },
        return: {
          padding: "0.5rem 0 0 2rem",
          textDecoration: "none",
          _hover: {
            textDecoration: "underline",
          },
          _visited: {
            color: "palette.primary",
          },
          display: "flex",
          ".icon": {
            width: "1.25rem",
            height: "1.25rem",
            marginTop: "0.15rem",
            marginRight: "0.5rem",
          },
        },
        inverse: {
          color: "palette.white",
          _visited: {
            color: "palette.white",
            textDecorationColor: "palette.white",
          },
          ":hover, :visited:hover": {
            color: "palette.gray_lighter",
            textDecorationColor: "palette.gray_lighter",
          },
        },
        unstyled: {
          textDecoration: "none",
          ":focus, :focus-visible, :hover, :visited, :visited:hover": {
            textDecoration: "none",
          },
        },
      },
      defaultProps: {
        variant: "primary",
      },
    },
    List: {
      baseStyle: {
        container: {},
      },
      variants: {
        accordian: {
          container: {
            paddingLeft: "1rem",
          },
        },
      },
    },
    Table: {
      baseStyle: {
        table: {
          marginBottom: "2.5rem",
          th: {
            padding: "0.5rem 0",
            borderBottom: "1px solid",
            borderColor: "palette.gray_light",
            color: "palette.gray_medium",
            fontWeight: "bold",
          },
          tr: {
            borderBottom: "1px solid",
            borderColor: "palette.gray_light",
          },
          td: {
            minWidth: "6rem",
            padding: "0.5rem 0.75rem",
            paddingLeft: 0,
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "palette.gray_light",
            textAlign: "left",
            "&:last-of-type": {
              paddingRight: 0,
            },
            "&:first-of-type": {
              minWidth: "2rem",
            },
          },
        },
      },
    },
    Text: {
      baseStyle: {
        color: "palette.base",
        transition: "all 0.3s ease",
      },
    },
  },
  styles: {
    global: {
      body: {
        color: "palette.base",
      },
    },
  },
});

export default theme;
