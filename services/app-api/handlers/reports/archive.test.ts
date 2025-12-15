import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { Report } from "../../types/reports";
import { updateArchiveStatus } from "./archive";

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn().mockResolvedValue({
    role: UserRoles.ADMIN,
  }),
}));

const permissionMock = jest.fn().mockReturnValue(true);
jest.mock("../../utils/authorization", () => ({
  canArchiveReport: () => permissionMock(),
}));

const putMock = jest.fn();
jest.mock("../../storage/reports", () => ({
  getReport: jest.fn().mockReturnValue({ id: "A report", archived: false }),
  putReport: (report: Report) => putMock(report),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  pathParameters: {
    reportType: "XYZ",
    state: "PA",
    id: "myVeryFavoriteReport",
  },
  body: JSON.stringify({ archived: true }),
  headers: { "cognito-identity-id": "test" },
};

describe("Test archive report handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateArchiveStatus", () => {
    test("missing path params", async () => {
      const badTestEvent: APIGatewayProxyEvent = {
        ...proxyEvent,
        headers: { "cognito-identity-id": "test" },
      };
      const res = await updateArchiveStatus(badTestEvent);
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
    });

    it("should return 403 if user is not authorized", async () => {
      permissionMock.mockReturnValueOnce(false);
      const response = await updateArchiveStatus(testEvent);
      expect(response.statusCode).toBe(StatusCodes.Forbidden);
    });

    it("should return Bad Request if user is not authorized", async () => {
      const noBodyEvent: APIGatewayProxyEvent = {
        ...proxyEvent,
        pathParameters: {
          reportType: "XYZ",
          state: "PA",
          id: "myVeryFavoriteReport",
        },
        headers: { "cognito-identity-id": "test" },
      };

      const response = await updateArchiveStatus(noBodyEvent);
      expect(response.statusCode).toBe(StatusCodes.BadRequest);
    });

    test("Successful archival", async () => {
      const res = await updateArchiveStatus(testEvent);

      expect(res.statusCode).toBe(StatusCodes.Ok);
      expect(putMock).toHaveBeenCalledWith({ id: "A report", archived: true });
    });
  });
});
