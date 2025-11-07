import { Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import { PageTemplate } from "components";
import warningIcon from "assets/icons/alert/icon_warning.svg";
import { HELP_DESK_EMAIL_ADDRESS } from "../../constants";

export const Error = () => {
  return (
    <PageTemplate sxOverride={sx.layout}>
      <Flex sx={sx.heading}>
        <Image src={warningIcon} alt="warning icon" sx={sx.warningIcon} />
        <Heading as="h1" sx={sx.headerText}>
          Error
        </Heading>
      </Flex>
      <Heading as="h2" sx={sx.subHeadingText}>
        Sorry! An error has occurred.
      </Heading>
      <Text sx={sx.descriptionText}>
        Please refresh and try again, or email{" "}
        <Link href={`mailto:${HELP_DESK_EMAIL_ADDRESS}`} isExternal>
          {HELP_DESK_EMAIL_ADDRESS}
        </Link>{" "}
        for help.
      </Text>
    </PageTemplate>
  );
};

const sx = {
  layout: {
    marginBottom: "spacer3",
  },
  heading: {
    gap: "12px",
    marginBottom: "spacer2",
    alignItems: "center",
  },
  warningIcon: {
    boxSize: "2rem",
    ".mobile &": {
      boxSize: "1.5rem",
    },
  },
  headerText: {
    fontSize: "heading_3xl",
    fontWeight: "heading_3xl",
    ".mobile &": {
      fontSize: "heading_2xl",
    },
  },
  subHeadingText: {
    fontSize: "heading_lg",
    fontWeight: "heading_lg",
    marginBottom: "spacer2",
    ".mobile &": {
      marginBottom: "spacer3",
    },
  },
  descriptionText: {
    fontSize: "body_md",
  },
};
