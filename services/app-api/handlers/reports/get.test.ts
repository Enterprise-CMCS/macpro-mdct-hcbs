import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent } from "../../types/types";
import { get } from "./get";

jest.mock("../../utils/authorization", () => ({
  isAuthenticated: jest.fn().mockResolvedValue(true),
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
    const res = await get(badTestEvent, null);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });
  test("Test Successful get", async () => {
    const res = await get(testEvent, null);

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
