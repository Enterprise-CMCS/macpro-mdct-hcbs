import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import { PageTemplate } from "components";
import { Checkbox } from "components/checkbox/Checkbox";
import { useEffect, useState } from "react";
import { ReportType } from "types";
import { Notification } from "types/notification";
import {
  getNotifications,
  updateNotifications,
} from "utils/api/requestMethods/notifications";

const REPORTS = Object.values(ReportType) as ReportType[];

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await getNotifications();
      setLoading(false);
      setNotifications(result);
    })();
  }, []);

  const enableNotification = (category: ReportType) =>
    notifications.find((report) => report.category === category)?.enabled ??
    false;

  const saveNotificationStatus = async (
    category: ReportType,
    enabled: boolean
  ) => {
    setNotifications((prev) => {
      const exists = prev.some((report) => report.category === category);
      return exists
        ? prev.map((report) =>
            report.category === category ? { ...report, enabled } : report
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
      {loading ? (
        <Flex sx={sx.spinnerContainer}>
          <Spinner size="md" />
        </Flex>
      ) : (
        <Box>
          {REPORTS.map((report) => (
            <Checkbox
              key={report}
              id={`checkbox-${report}`}
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
      )}
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
  spinnerContainer: {
    marginTop: "spacer1",
    ".ds-c-spinner": {
      "&:before": {
        borderColor: "palette.black",
      },
      "&:after": {
        borderLeftColor: "palette.black",
      },
    },
  },
};
