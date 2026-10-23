import { string } from "yup";
import { logger } from "../libs/debug-lib";
import {
  isNotificationState,
  NotificationAssignment,
} from "../types/notification";
import { isReportType } from "../types/reports";

export const normalizeNotificationAssignment = (
  assignment: NotificationAssignment
): NotificationAssignment => ({
  email: assignment.email.trim().toLowerCase(),
  states: [...new Set(assignment.states)],
  reports: [...new Set(assignment.reports)],
});

export const isValidNotificationAssignment = (
  assignment: unknown
): assignment is NotificationAssignment => {
  if (!assignment || typeof assignment !== "object") {
    logger.warn("Invalid: notification assignment must be an object");
    return false;
  }

  if (
    Object.keys(assignment).some(
      (key) => !["email", "states", "reports"].includes(key)
    )
  ) {
    logger.warn("Invalid: notification assignment contains unwanted fields");
    return false;
  }

  if (
    !("email" in assignment) ||
    typeof assignment.email !== "string" ||
    assignment.email.length > 254 ||
    !string().email().required().isValidSync(assignment.email.trim())
  ) {
    logger.warn("Invalid: assignment.email must be a valid email address");
    return false;
  }

  if (
    !("states" in assignment) ||
    !Array.isArray(assignment.states) ||
    assignment.states.length === 0 ||
    !assignment.states.every(
      (state: unknown) =>
        typeof state === "string" && isNotificationState(state)
    )
  ) {
    logger.warn(
      "Invalid: assignment.states must contain valid state abbreviations or be the ALL designation"
    );
    return false;
  }

  if (
    !("reports" in assignment) ||
    !Array.isArray(assignment.reports) ||
    assignment.reports.length === 0 ||
    !assignment.reports.every(isReportType)
  ) {
    logger.warn("Invalid: assignment.reports must contain valid report types");
    return false;
  }

  return true;
};
