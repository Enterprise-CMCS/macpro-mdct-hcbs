import { Flex, Heading, Image, Link, Text, Box } from "@chakra-ui/react";
import { PageTemplate } from "components";
import warningIcon from "assets/icons/alert/icon_warning.svg";
import { HELP_DESK_EMAIL_ADDRESS } from "../../../constants";

export const NotFoundPage = () => {
  return (
    <PageTemplate sxOverride={sx.layout}>
      <Flex sx={sx.heading}>
        <Image src={warningIcon} alt="warning icon" sx={sx.warningIcon} />
        <Heading as="h1" variant="h1">
          Page not found
        </Heading>
      </Flex>
      <Heading as="h2" variant="subHeader">
        Sorry, the page you're looking for couldn't be found. It's possible that
        this page has moved, or the address may have been typed incorrectly.
      </Heading>
      <Box>
        <Text>
          Please email{" "}
          <Link href={`mailto:${HELP_DESK_EMAIL_ADDRESS}`} isExternal>
            {HELP_DESK_EMAIL_ADDRESS}
          </Link>{" "}
          for help or feedback.
        </Text>
        <Text>
          Note: If you were using a bookmark, please reset it once you find the
          correct page.
        </Text>
      </Box>
    </PageTemplate>
  );
};

const sx = {
  layout: {
    marginBottom: "spacer3",
    ".contentFlex": {
      maxWidth: "35rem",
    },
  },
  heading: {
    gap: "spacer2",
    alignItems: "center",
  },
  warningIcon: {
    boxSize: "2rem",
    ".mobile &": {
      boxSize: "1.5rem",
    },
  },
};
