import { initAuthManager } from "utils/auth/authLifecycle";
import { ReportType } from "types";
import { Notifications } from "types/notification";
import { getNotifications, updateNotifications } from "./notifications";

const mockNotifications: Notifications[] = [
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
});
