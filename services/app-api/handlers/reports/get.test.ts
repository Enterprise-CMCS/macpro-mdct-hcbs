import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent } from "../../types/types";
import { getReport, getReportsForState } from "./get";

jest.mock("../../utils/authorization", () => ({
  isAuthenticated: jest.fn().mockResolvedValue(true),
}));

jest.mock("../../storage/reports", () => ({
  getReport: jest.fn().mockReturnValue({ id: "A report" }),
  queryReportsForState: jest.fn().mockReturnValue([{ id: "A report" }]),
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

  describe("getReport", () => {
    test("Test missing path params", async () => {
      const badTestEvent: APIGatewayProxyEvent = {
        ...proxyEvent,
        headers: { "cognito-identity-id": "test" },
      };
      const res = await getReport(badTestEvent, null);
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
    });

    test("Test Successful get", async () => {
      const res = await getReport(testEvent, null);

      expect(res.statusCode).toBe(StatusCodes.Ok);
    });
  });

  describe("getReportsForState", () => {
    test("Test missing path params", async () => {
      const badTestEvent: APIGatewayProxyEvent = {
        ...proxyEvent,
        headers: { "cognito-identity-id": "test" },
      };
      const res = await getReportsForState(badTestEvent, null);
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
    });

    test("Test Successful get", async () => {
      const res = await getReportsForState(testEvent, null);

      expect(res.statusCode).toBe(StatusCodes.Ok);
    });
  });
});
