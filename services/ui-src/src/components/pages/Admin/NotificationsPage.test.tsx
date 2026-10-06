import { beforeEach, describe, vi } from "vitest";

vi.mock("utils/api/requestMethods/notifications", () => ({
  getNotifications: vi.fn(),
  updateNotifications: vi.fn(),
}));

vi.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: vi.fn().mockReturnValue({ notificationsSystem: true }),
}));

describe("<NotificationsPage />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
});
