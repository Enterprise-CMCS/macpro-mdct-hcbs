import { beforeEach, describe, expect, it, vi } from "vitest";
import { StatusCodes } from "../../libs/response-lib";
import { APIGatewayProxyEvent, User, UserRoles } from "../../types/types";
import { authenticatedUser } from "../../utils/authentication";
import { Notification } from "../../types/notification";
import { ReportType } from "../../types/reports";
import { updateNotifications } from "./put";

vi.mock("../../utils/authentication", () => ({
  authenticatedUser: vi.fn(),
}));
const mockUser = {
  role: UserRoles.ADMIN,
  fullName: "mock username",
} as User;
vi.mocked(authenticatedUser).mockReturnValue(mockUser);

vi.mock("../../storage/notifications", () => ({
  scanAllNotifications: vi.fn(),
  putNotifications: vi.fn(),
}));

const mockNotification: Notification = {
  category: ReportType.WWL,
  enabled: true,
};

const mockFalseNotification = {
  category: ReportType.WWL,
  enabled: "hi",
};

const mockEvent = {
  body: JSON.stringify(mockNotification),
} as APIGatewayProxyEvent;

const mockFalseEvent = {
  body: JSON.stringify(mockFalseNotification),
} as APIGatewayProxyEvent;

describe("putNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return an error if the user is not authorized", async () => {
    vi.mocked(authenticatedUser).mockReturnValueOnce({
      ...mockUser,
      role: UserRoles.STATE_USER,
    });

    const res = await updateNotifications(mockEvent);

    expect(res.statusCode).toBe(StatusCodes.Forbidden);
  });

  it("should return an error if the notification data is invalid", async () => {
    vi.mocked(authenticatedUser).mockReturnValueOnce({
      ...mockUser,
      role: UserRoles.ADMIN,
    });

    const res = await updateNotifications(mockFalseEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should put data if the user is authorized and data is valid", async () => {
    vi.mocked(authenticatedUser).mockReturnValueOnce({
      ...mockUser,
      role: UserRoles.ADMIN,
    });

    const res = await updateNotifications(mockEvent);
    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
