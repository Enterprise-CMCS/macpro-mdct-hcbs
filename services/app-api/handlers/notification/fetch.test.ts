import { beforeEach, describe, expect, it, vi } from "vitest";
import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { fetchNotifications } from "./fetch";
import { scanAllNotifications } from "../../storage/notifications";
import { ReportType } from "../../types/reports";
import { Notification } from "../../types/notification";

vi.mock("../../utils/authentication", () => ({
  authenticatedUser: vi.fn().mockResolvedValue({
    role: UserRoles.ADMIN,
    state: "PA",
  }),
}));

vi.mock("../../utils/authorization", () => ({
  isAuthenticated: vi.fn().mockReturnValue(true),
}));

vi.mock("../../storage/notifications", () => ({
  scanAllNotifications: vi.fn(),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
};

const mockNotification: Notification = {
  category: ReportType.QMS,
  enabled: true,
};

describe("notifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should query Dynamo for notification data", async () => {
    vi.mocked(scanAllNotifications).mockResolvedValueOnce([mockNotification]);
    const res = await fetchNotifications(testEvent);
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(JSON.parse(res.body!)).toEqual([mockNotification]);
  });

  it("should return an empty array if no checked notification exist", async () => {
    vi.mocked(scanAllNotifications).mockResolvedValueOnce([]);
    const res = await fetchNotifications(testEvent);
    expect(res.body).toBe("[]");
    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
