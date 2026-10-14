import { beforeEach, describe, expect, it, vi } from "vitest";
import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { updateArchiveStatus } from "./archive";
import { putReport } from "../../storage/reports";
import { canArchiveReport } from "../../utils/authorization";

vi.mock("../../utils/authentication", () => ({
  authenticatedUser: vi.fn().mockResolvedValue({
    role: UserRoles.ADMIN,
  }),
}));

vi.mock("../../utils/authorization", () => ({
  canArchiveReport: vi.fn().mockReturnValue(true),
}));

vi.mock("../../storage/reports", () => ({
  getReport: vi.fn().mockReturnValue({ id: "A report", archived: false }),
  putReport: vi.fn(),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  pathParameters: {
    reportType: "QMS",
    state: "PA",
    id: "myVeryFavoriteReport",
  },
  body: JSON.stringify({ archived: true }),
  headers: { "cognito-identity-id": "test" },
};

describe("updateArchiveStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return Bad Request when missing path params", async () => {
    const badTestEvent: APIGatewayProxyEvent = {
      ...proxyEvent,
      headers: { "cognito-identity-id": "test" },
    };
    const res = await updateArchiveStatus(badTestEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return Forbidden if user is not authorized", async () => {
    vi.mocked(canArchiveReport).mockReturnValueOnce(false);
    const response = await updateArchiveStatus(testEvent);
    expect(response.statusCode).toBe(StatusCodes.Forbidden);
  });

  it("should return Bad Request when request body is missing", async () => {
    const noBodyEvent: APIGatewayProxyEvent = {
      ...proxyEvent,
      pathParameters: {
        reportType: "QMS",
        state: "PA",
        id: "myVeryFavoriteReport",
      },
      headers: { "cognito-identity-id": "test" },
    };

    const response = await updateArchiveStatus(noBodyEvent);
    expect(response.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should successfully archive a report", async () => {
    const res = await updateArchiveStatus(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(putReport).toHaveBeenCalledWith({
      id: "A report",
      archived: true,
    });
  });
});
