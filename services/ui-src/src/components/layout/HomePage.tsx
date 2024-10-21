import { Box, Heading, Link, Text } from "@chakra-ui/react";
import { PageTemplate, TemplateCard } from "components";
import verbiage from "verbiage/pages/home";

export const HomePage = () => {
  const { intro, cards } = verbiage;

  return (
    <PageTemplate>
      <>
        <Box>
          <Heading as="h1" variant="h1">
            {intro.header}
          </Heading>
          <Text>
            {intro.body.preLinkText}
            <Link href={intro.body.linkLocation} isExternal>
              {intro.body.linkText}
            </Link>
            {intro.body.postLinkText}
          </Text>
          <Text></Text>
        </Box>
        <TemplateCard templateName="QM" verbiage={cards.QM} />
      </>
    </PageTemplate>
  );
};
