import { beforeEach, describe, expect, it, vi } from "vitest";
import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { canReadState } from "../../utils/authorization";
import { getReport, getReportsForState } from "./get";

vi.mock("../../utils/authentication", () => ({
  authenticatedUser: vi.fn().mockResolvedValue({
    role: UserRoles.STATE_USER,
    state: "PA",
  }),
}));

vi.mock("../../utils/authorization", () => ({
  canReadState: vi.fn().mockReturnValue(true),
}));

vi.mock("../../storage/reports", () => ({
  getReport: vi.fn().mockReturnValue({ id: "A report" }),
  queryReportsForState: vi
    .fn()
    .mockReturnValue([{ id: "A report" }, { id: "B report" }]),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  pathParameters: {
    reportType: "QMS",
    state: "PA",
    id: "myVeryFavoriteReport",
  },
  headers: { "cognito-identity-id": "test" },
};

describe("Get Report Handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getReport", () => {
    it("should return Bad Request if missing path params", async () => {
      const badTestEvent: APIGatewayProxyEvent = {
        ...proxyEvent,
        headers: { "cognito-identity-id": "test" },
      };
      const res = await getReport(badTestEvent);
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
    });

    it("should return Forbidden if user is not authorized", async () => {
      vi.mocked(canReadState).mockReturnValueOnce(false);
      const response = await getReport(testEvent);
      expect(response.statusCode).toBe(StatusCodes.Forbidden);
    });

    it("should successfully return a report", async () => {
      const res = await getReport(testEvent);

      expect(res.statusCode).toBe(StatusCodes.Ok);
      expect(JSON.parse(res.body!)).toEqual({ id: "A report" });
    });
  });

  describe("getReportsForState", () => {
    it("should return Bad Request if missing path params", async () => {
      const badTestEvent: APIGatewayProxyEvent = {
        ...proxyEvent,
        headers: { "cognito-identity-id": "test" },
      };
      const res = await getReportsForState(badTestEvent);
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
    });

    it("should return Forbidden if user is not authorized", async () => {
      vi.mocked(canReadState).mockReturnValueOnce(false);
      const response = await getReportsForState(testEvent);
      expect(response.statusCode).toBe(StatusCodes.Forbidden);
    });

    it("should successfully return a list of report metadata", async () => {
      const res = await getReportsForState(testEvent);

      expect(res.statusCode).toBe(StatusCodes.Ok);
      expect(JSON.parse(res.body!)).toEqual([
        { id: "A report" },
        { id: "B report" },
      ]);
    });
  });
});
