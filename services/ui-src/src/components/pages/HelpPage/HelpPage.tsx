import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { HelpCard, PageTemplate } from "components";
import { HELP_DESK_EMAIL_ADDRESS } from "../../../constants";
import { useBreakpoint } from "utils";

const mfpDemoEmailAddress = "MFPDemo@cms.hhs.gov";

export const HelpPage = () => {
  const { isDesktop } = useBreakpoint();
  return (
    <PageTemplate>
      <Box>
        <Heading as="h1" variant="h1">
          How can we help you?
        </Heading>
        <Text>
          Question or feedback? Please email us and we will respond as soon as
          possible. You can also review our frequently asked questions below.
        </Text>
      </Box>
      <Flex flexDirection="column" gap="1.5rem">
        <HelpCard icon="settings">
          <Text sx={sx.bodyText}>For technical support and login issues:</Text>
          <Text sx={sx.emailText}>
            Email {!isDesktop && <br />}
            <Link href={`mailto:${HELP_DESK_EMAIL_ADDRESS}`} target="_blank">
              {HELP_DESK_EMAIL_ADDRESS}
            </Link>
          </Text>
        </HelpCard>
        <HelpCard icon="spreadsheet">
          <Text sx={sx.bodyText}>For questions about the online form:</Text>
          <Text sx={sx.emailText}>
            Email {!isDesktop && <br />}
            <Link href={`mailto:${mfpDemoEmailAddress}`} target="_blank">
              {mfpDemoEmailAddress}
            </Link>
          </Text>
        </HelpCard>
      </Flex>
    </PageTemplate>
  );
};

const sx = {
  bodyText: {
    marginBottom: "1rem",
  },
  emailText: {
    fontWeight: "bold",
  },
  accordionItem: {
    marginBottom: "1.5rem",
    borderStyle: "none",
  },
  accordionPanel: {
    ".mobile &": {
      paddingLeft: "1rem",
    },
  },
};
