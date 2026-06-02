import { initAuthManager } from "utils/auth/authLifecycle";
import { ReportType } from "types";
import { Notification } from "types/notification";
import {
  getNotifications,
  updateNotifications,
  sendTestEmail,
} from "./notifications";

const mockNotifications: Notification[] = [
  {
    category: ReportType.CI,
    enabled: true,
  },
  {
    category: ReportType.WWL,
    enabled: true,
  },
];

describe("utils/notifications", () => {
  beforeEach(async () => {
    initAuthManager();
  });

  describe("getNotifications()", () => {
    test("executes", () => {
      expect(getNotifications()).toBeTruthy();
    });
  });

  describe("updateNotifications()", () => {
    test("executes", () => {
      expect(updateNotifications(mockNotifications[0])).toBeTruthy();
    });
  });

  describe("sendTestEmail()", () => {
    test("executes", () => {
      expect(
        sendTestEmail({
          toAddress: "test@example.com",
          subject: "Test Subject",
          message: "Test message",
        })
      ).toBeTruthy();
    });
  });
});
