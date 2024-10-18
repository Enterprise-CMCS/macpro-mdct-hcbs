import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { EmailCard, FaqAccordion, PageTemplate } from "components";
import verbiage from "verbiage/pages/help";

export const HelpPage = () => {
  const { intro, cards, accordionItems } = verbiage;
  return (
    <PageTemplate>
      <Box>
        <Heading as="h1" variant="h1">
          {intro.header}
        </Heading>
        <Text>{intro.body}</Text>
      </Box>
      <Flex flexDirection="column" gap="1.5rem">
        <EmailCard verbiage={cards.helpdesk} icon="settings" />
        <EmailCard verbiage={cards.template} icon="spreadsheet" />
      </Flex>
      {accordionItems.length > 0 && (
        <Box>
          <FaqAccordion accordionItems={accordionItems} />
        </Box>
      )}
    </PageTemplate>
  );
};
