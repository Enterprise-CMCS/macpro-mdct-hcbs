import { Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import { PageTemplate } from "components";
import { createEmailLink } from "utils/other/email";
import warningIcon from "assets/icons/alert/icon_warning.svg";
import verbiage from "verbiage/pages/error";

export const Error = () => {
  const { header, subHeading, emailText } = verbiage;
  const { preLinkText, helpDeskEmail, postLinkText } = emailText;

  return (
    <PageTemplate sxOverride={sx.layout}>
      <Flex sx={sx.heading}>
        <Image src={warningIcon} alt="warning icon" sx={sx.warningIcon} />
        <Heading as="h1" sx={sx.headerText}>
          {header}
        </Heading>
      </Flex>
      <Heading as="h2" sx={sx.subHeadingText}>
        {subHeading}
      </Heading>
      <Text sx={sx.descriptionText}>
        {preLinkText}
        <Link href={createEmailLink({ address: helpDeskEmail })} isExternal>
          {helpDeskEmail}
        </Link>
        {postLinkText}
      </Text>
    </PageTemplate>
  );
};

const sx = {
  layout: {
    marginBottom: "1.5rem",
  },
  heading: {
    gap: "12px",
    marginBottom: "1rem",
    alignItems: "center",
  },
  warningIcon: {
    boxSize: "2rem",
    ".mobile &": {
      boxSize: "1.5rem",
    },
  },
  headerText: {
    fontSize: "4xl",
    fontWeight: "normal",
    ".mobile &": {
      fontSize: "2xl",
    },
  },
  subHeadingText: {
    fontSize: "lg",
    fontWeight: "bold",
    marginBottom: "1rem",
    ".mobile &": {
      marginBottom: "1.5rem",
    },
  },
  descriptionText: {
    fontSize: "md",
  },
};
