// components
import { Flex, Heading, Image, Link, Text, Box } from "@chakra-ui/react";
import { PageTemplate } from "components";
// utils
import { createEmailLink } from "utils/other/email";
// assets
import warningIcon from "assets/icons/alert/icon_warning.svg";
import verbiage from "./../../../verbiage/not-found";

export const NotFoundPage = () => {
  const { header, subHeading, emailText, body } = verbiage;
  const { preLinkText, cmsEmail, postLinkText } = emailText;

  return (
    <PageTemplate data-testid="404-view" sxOverride={sx.layout}>
      <Flex sx={sx.heading}>
        <Image src={warningIcon} alt="warning icon" sx={sx.warningIcon} />
        <Heading as="h1" variant="h1">
          {header}
        </Heading>
      </Flex>
      <Heading as="h2" sx={sx.subHeadingText}>
        {subHeading}
      </Heading>
      <Box>
        <Text sx={sx.descriptionText}>
          {preLinkText}
          <Link href={createEmailLink({ address: cmsEmail })}>{cmsEmail}</Link>
          {postLinkText}
        </Text>
        <Text>{body}</Text>
      </Box>
    </PageTemplate>
  );
};

const sx = {
  layout: {
    marginBottom: "1.5rem",
    ".contentFlex": {
      maxWidth: "35rem",
    },
  },
  heading: {
    gap: "12px",
    alignItems: "center",
  },
  warningIcon: {
    boxSize: "2rem",
    ".mobile &": {
      boxSize: "1.5rem",
    },
  },
  subHeadingText: {
    fontSize: "lg",
    fontWeight: "bold",
    ".mobile &": {},
  },
  descriptionText: {
    fontSize: "md",
  },
};
