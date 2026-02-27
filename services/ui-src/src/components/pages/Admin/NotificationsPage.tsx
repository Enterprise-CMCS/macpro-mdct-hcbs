import { Box, Heading } from "@chakra-ui/react";
import { PageTemplate } from "components";
import { Checkbox } from "components/checkbox/Checkbox";
import { useEffect, useState } from "react";
import { ReportType } from "types";
import { Notifications } from "types/notifications";
import { useStore } from "utils";

const REPORTS = Object.values(ReportType) as ReportType[];

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const { fetchNotifications, updateNotifications } = useStore();

  useEffect(() => {
    (async () => {
      await fetchNotifications();
    })();
  }, []);

  const enableNotification = (category: ReportType) =>
    notifications.find((report) => report.category === category)?.enabled ??
    false;

  const saveNotificationStatus = async (
    category: ReportType,
    enabled: boolean,
  ) => {
    setNotifications((prev) => {
      const exists = prev.some((report) => report.category === category);
      return exists
        ? prev.map((report) =>
            report.category === category ? { ...report, enabled } : report,
          )
        : [...prev, { category, enabled }];
    });

    await updateNotifications({ category, enabled });
  };

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
        {REPORTS.map((report) => (
          <Checkbox
            key={report}
            id={`toggle-${report}`}
            name="notifications"
            value={report}
            label={report}
            checked={enableNotification(report)}
            onCheckedChange={(checked) =>
              saveNotificationStatus(report, checked)
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
