import { logger } from "../libs/debug-lib";
import { Notifications } from "../types/notifications";
import { isReportType } from "../types/reports";

export const isValidNotification = (notification: unknown): notification is Notifications => {
  if (!notification || "object" !== typeof notification) {
    logger.warn("Invalid: notification must be an object");
    return false;
  }

  const requiredFields = [
    "category",
    "enabled",
  ];

  if (Object.keys(notification).some((key) => !requiredFields.includes(key))) {
    logger.warn("Invalid: notification contains unwanted fields");
    return false;
  }

  if (!("category" in notification) || !isReportType(notification.category)) {
    logger.warn("Invalid: notification.category must be a valid ReportType");
    return false;
  }

  if (!("enabled" in notification) || "boolean" !== typeof notification.enabled) {
    logger.warn("Invalid: notification.enabled must be a boolean");
    return false;
  }

  return true;
};
