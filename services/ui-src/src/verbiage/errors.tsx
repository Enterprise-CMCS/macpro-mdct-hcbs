import { Link } from "@chakra-ui/react";
import { ErrorVerbiage } from "types";

const helpDeskEmailAddress = "mdct_help@cms.hhs.gov";

export const genericErrorContent = (
  <>
    <p>Something went wrong on our end. Refresh your screen and try again.</p>
    <p>
      If this persists, contact the MDCT Help Desk with questions or to request
      technical assistance by emailing
      <Link
        href={`mailto:${helpDeskEmailAddress}`}
        target="_blank"
        color="black"
        fontWeight="bold"
      >
        {helpDeskEmailAddress}
      </Link>
      .
    </p>
  </>
);

export const bannerErrors: Record<string, ErrorVerbiage> = {
  GET_BANNER_FAILED: {
    title: "Banner could not be fetched",
    children: genericErrorContent,
  },
  REPLACE_BANNER_FAILED: {
    title: "Current banner could not be replaced.",
    children: genericErrorContent,
  },
  DELETE_BANNER_FAILED: {
    title: "Current banner could not be deleted",
    children: genericErrorContent,
  },
  CREATE_BANNER_FAILED: {
    title: "Could not create a banner.",
    children: genericErrorContent,
  },
};
