import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { canReadState } from "../../utils/authorization";
import { get } from "./get";

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn().mockResolvedValue({
    role: UserRoles.STATE_USER,
    state: "PA",
  }),
}));

jest.mock("../../utils/authorization", () => ({
  canReadState: jest.fn().mockReturnValue(true),
}));

jest.mock("../../storage/reports", () => ({
  getReport: jest.fn().mockReturnValue({ id: "A report" }),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  pathParameters: { reportType: "QM", state: "PA", id: "myVeryFavoriteReport" },
  headers: { "cognito-identity-id": "test" },
};

describe("Test get report handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Test missing path params", async () => {
    const badTestEvent: APIGatewayProxyEvent = {
      ...proxyEvent,
      headers: { "cognito-identity-id": "test" },
    };
    const res = await get(badTestEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return 403 if user is not authorized", async () => {
    (canReadState as jest.Mock).mockReturnValueOnce(false);
    const response = await get(testEvent);
    expect(response.statusCode).toBe(StatusCodes.Forbidden);
  });

  test("Test Successful get", async () => {
    const res = await get(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
