import { StatusCodes } from "../../libs/response-lib";
import { APIGatewayProxyEvent, User, UserRoles } from "../../types/types";
import { authenticatedUser as actualAuthenticatedUser } from "../../utils/authentication";
import { Notifications } from "../../types/notifications";
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

const mockNotification: Notifications = {
  category: ReportType.WWL,
  enabled: true,
};

const mockEvent = {
  body: JSON.stringify(mockNotification),
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
});
