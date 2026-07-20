import { initAuthManager } from "utils/auth/authLifecycle";
import { ReportType } from "types";
import { Notification } from "types/notification";
import {
  getNotifications,
  updateNotifications,
  sendTestEmail,
} from "./notifications";

const mockPost = require("aws-amplify/api").post;

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
    test("calls the test-email endpoint with the provided payload", async () => {
      const payload = {
        toAddress: "test@example.com",
        subject: "Test Subject",
        message: "Test message",
      };
      await sendTestEmail(payload);
      expect(mockPost).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/notifications/test-email",
          options: expect.objectContaining({
            body: payload,
          }),
        })
      );
    });
  });
});
