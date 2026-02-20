import { Box, Heading } from "@chakra-ui/react";
import { PageTemplate } from "components";
import { ToggleButton } from "components/toggle/ToggleButton";

export const NotificationsPage = () => {
  return (
    <PageTemplate data-testid="notifications-view">
      <Box sx={sx.introTextBox}>
        <Heading as="h1" id="NotificationsHeader" tabIndex={-1} sx={sx.headerText}>
          Notifications
        </Heading>
      </Box>
      <Box>
        <ToggleButton label="QMS" id="QMS-Toggle" />
        <ToggleButton label="TACM" id="TACM-Toggle" />
        <ToggleButton label="CI" id="CI-Toggle" />
        <ToggleButton label="PCP" id="PCP-Toggle" />
        <ToggleButton label="WWL" id="WWL-Toggle" />
      </Box>
    </PageTemplate>
  );
};

const sx = {
  introTextBox: {
    width: "100%",
  },
  headerText: {
    marginBottom: "spacer2",
    fontSize: "heading_3xl",
    fontWeight: "heading_3xl",
  },
};
