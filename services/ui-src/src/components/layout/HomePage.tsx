import { Box, Heading, Link, Text } from "@chakra-ui/react";
import { AdminDashSelector, PageTemplate, TemplateCard } from "components";
import { useStore } from "utils";
import verbiage from "verbiage/pages/home";

export const HomePage = () => {
  const { intro, cards } = verbiage;
  const { userIsEndUser } = useStore().user ?? {};

  return (
    <PageTemplate>
      {/* show standard view to state users */}
      {userIsEndUser ? (
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
      ) : (
        // show read-only view to non-state users
        <AdminDashSelector verbiage={verbiage.readOnly} />
      )}
    </PageTemplate>
  );
};
