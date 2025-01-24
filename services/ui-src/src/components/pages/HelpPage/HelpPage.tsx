import { Accordion, Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { AccordionItem, EmailCard, PageTemplate } from "components";
import { useBreakpoint } from "utils";

const helpDeskEmailAddress = "mdct_help@cms.hhs.gov";
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
        <EmailCard icon="settings">
          <Text sx={sx.bodyText}>For technical support and login issues:</Text>
          <Text sx={sx.emailText}>
            Email {!isDesktop && <br />}
            <Link href={`mailto:${helpDeskEmailAddress}`} target="_blank">
              {helpDeskEmailAddress}
            </Link>
          </Text>
        </EmailCard>
        <EmailCard icon="spreadsheet">
          <Text sx={sx.bodyText}>For questions about the online form:</Text>
          <Text sx={sx.emailText}>
            Email {!isDesktop && <br />}
            <Link href={`mailto:${mfpDemoEmailAddress}`} target="_blank">
              {mfpDemoEmailAddress}
            </Link>
          </Text>
        </EmailCard>
      </Flex>
      <Box>
        <Accordion allowToggle={true} allowMultiple={true}>
          <AccordionItem
            label="How do I log into my IDM account?"
            sx={sx.accordionItem}
          >
            <Box sx={sx.accordionPanel}>
              <Text>TBD</Text>
            </Box>
          </AccordionItem>
          <AccordionItem label="Question #2" sx={sx.accordionItem}>
            <Box sx={sx.accordionPanel}>
              <Text>TBD</Text>
            </Box>
          </AccordionItem>
        </Accordion>
      </Box>
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
