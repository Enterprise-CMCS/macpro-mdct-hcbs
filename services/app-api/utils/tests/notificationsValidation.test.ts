import { logger } from "../../libs/debug-lib";
import { Notifications } from "../../types/notifications";
import { ReportType } from "../../types/reports";
import { isValidNotification } from "../notificationsValidation";

jest.mock("../../libs/debug-lib", () => ({
  logger: {
    warn: jest.fn(),
  },
}));
const warn = logger.warn as jest.Mock;

const validPayload: Notifications = {
  category: ReportType.CI,
  enabled: true,
};

describe("isValidNotifications", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should accept a valid payload", () => {
    expect(isValidNotification(validPayload)).toBe(true);
  });

  it("should reject a notification with invalid category", () => {
    expect(isValidNotification({ ...validPayload, category: "hello" })).toBe(
      false
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(
        "Invalid: notification.category must be a valid ReportType"
      )
    );
  });

  it("should reject a notification with non boolean type", () => {
    expect(
      isValidNotification({ ...validPayload, enabled: "not a boolean" })
    ).toBe(false);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("Invalid: notification.enabled must be a boolean")
    );
  });
});
