import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { fetchNotifications } from "./fetch";
import { scanAllNotifications } from "../../storage/notifications";
import { ReportType } from "../../types/reports";
import { Notification } from "../../types/notification";

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn().mockResolvedValue({
    role: UserRoles.ADMIN,
    state: "PA",
  }),
}));

jest.mock("../../utils/authorization", () => ({
  isAuthenticated: jest.fn().mockReturnValue(true),
}));

jest.mock("../../storage/notifications", () => ({
  scanAllNotifications: jest.fn(),
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
    jest.clearAllMocks();
  });

  it("should query Dynamo for notification data", async () => {
    (scanAllNotifications as jest.Mock).mockResolvedValueOnce([
      mockNotification,
    ]);
    const res = await fetchNotifications(testEvent);
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(JSON.parse(res.body!)).toEqual([mockNotification]);
  });

  it("should return an empty array if no checked notification exist", async () => {
    (scanAllNotifications as jest.Mock).mockResolvedValueOnce([]);
    const res = await fetchNotifications(testEvent);
    expect(res.body).toBe("[]");
    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
