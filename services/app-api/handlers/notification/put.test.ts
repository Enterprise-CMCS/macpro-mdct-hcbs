import { StatusCodes } from "../../libs/response-lib";
import { APIGatewayProxyEvent, User, UserRoles } from "../../types/types";
import { authenticatedUser as actualAuthenticatedUser } from "../../utils/authentication";
import { Notification } from "../../types/notification";
import { ReportType } from "../../types/reports";
import { updateNotifications } from "./put";

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn(),
}));

const authenticatedUser = actualAuthenticatedUser as jest.MockedFunction<
  typeof actualAuthenticatedUser
>;
const mockUser = {
  role: UserRoles.ADMIN,
  fullName: "mock username",
} as User;
authenticatedUser.mockReturnValue(mockUser);

jest.mock("../../storage/notifications", () => ({
  scanAllNotifications: jest.fn(),
  putNotifications: jest.fn(),
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
    jest.clearAllMocks();
  });

  it("should return an error if the user is not authorized", async () => {
    authenticatedUser.mockReturnValueOnce({
      ...mockUser,
      role: UserRoles.STATE_USER,
    });

    const res = await updateNotifications(mockEvent);

    expect(res.statusCode).toBe(StatusCodes.Forbidden);
  });

  it("should return an error if the notification data is invalid", async () => {
    authenticatedUser.mockReturnValueOnce({
      ...mockUser,
      role: UserRoles.ADMIN,
    });

    const res = await updateNotifications(mockFalseEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should put data if the user is authorized and data is valid", async () => {
    authenticatedUser.mockReturnValueOnce({
      ...mockUser,
      role: UserRoles.ADMIN,
    });

    const res = await updateNotifications(mockEvent);
    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
