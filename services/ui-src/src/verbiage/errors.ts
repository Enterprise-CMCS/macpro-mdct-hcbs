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

export const bannerErrors = {
  GET_BANNER_FAILED: {
    title: "Banner could not be fetched",
    description: genericErrorContent,
  },
  REPLACE_BANNER_FAILED: {
    title: "Current banner could not be replaced.",
    description: genericErrorContent,
  },
  DELETE_BANNER_FAILED: {
    title: "Current banner could not be deleted",
    description: genericErrorContent,
  },
  CREATE_BANNER_FAILED: {
    title: "Could not create a banner.",
    description: genericErrorContent,
  },
};
