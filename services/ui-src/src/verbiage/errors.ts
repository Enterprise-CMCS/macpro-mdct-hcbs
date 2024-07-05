export const genericErrorContent = [
  {
    type: "span",
    content:
      "Something went wrong on our end. Refresh your screen and try again.<br/>If this persists, contact the MDCT Help Desk with questions or to request technical assistance by emailing ",
  },
  {
    type: "externalLink",
    content: "mdct_help@cms.hhs.gov",
    props: {
      href: "mailto:mdct_help@cms.hhs.gov",
      target: "_blank",
      color: "black",
      fontWeight: "bold",
    },
  },
  {
    type: "span",
    content: ".",
  },
];