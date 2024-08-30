import { Box, Heading, Link, Text } from "@chakra-ui/react";
import { PageTemplate, TemplateCard } from "components";
import verbiage from "verbiage/pages/home";

export const HomePage = () => {
  const { intro, cards } = verbiage;

  return (
    <PageTemplate sx={sx.layout}>
      <>
        <Box sx={sx.introTextBox}>
          <Heading as="h1" sx={sx.headerText}>
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
        <TemplateCard
          templateName="QM"
          verbiage={cards.QM}
          cardprops={sx.card}
        />
      </>
    </PageTemplate>
  );
};

const sx = {
  layout: {
    ".contentFlex": {
      marginTop: "3.5rem",
    },
  },
  introTextBox: {
    width: "100%",
    marginBottom: "2.25rem",
  },
  headerText: {
    marginBottom: "1rem",
    fontSize: "2rem",
    fontWeight: "normal",
  },
  card: {
    marginBottom: "2rem",
  },
};
