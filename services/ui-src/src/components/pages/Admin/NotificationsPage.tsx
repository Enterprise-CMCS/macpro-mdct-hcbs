import { Box, Heading } from "@chakra-ui/react";
import { PageTemplate } from "components";
import { ToggleButton } from "components/toggle/ToggleButton";
import { useEffect, useState } from "react";

export const NotificationsPage = () => {
  const STORAGE_KEY = "notification-toggles";
  const [notificationSettings, setNotificationSettings] = useState<
    Record<string, boolean>
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  const reports = [
    { id: "Toggle-QMS", label: "QMS" },
    { id: "Toggle-TACM", label: "TACM" },
    { id: "Toggle-CI", label: "CI" },
    { id: "Toggle-PCP", label: "PCP" },
    { id: "Toggle-WWL", label: "WWL" },
  ];

  return (
    <PageTemplate data-testid="notifications-view">
      <Box sx={sx.introTextBox}>
        <Heading
          as="h1"
          id="NotificationsHeader"
          tabIndex={-1}
          sx={sx.headerText}
        >
          Notifications
        </Heading>
      </Box>
      <Box>
        {reports.map((report) => (
          <ToggleButton
            key={report.id}
            id={report.id}
            label={report.label}
            checked={notificationSettings[report.id] ?? false}
            onCheckedChange={(checked) =>
              setNotificationSettings((prev) => ({
                ...prev,
                [report.id]: checked,
              }))
            }
          />
        ))}
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
