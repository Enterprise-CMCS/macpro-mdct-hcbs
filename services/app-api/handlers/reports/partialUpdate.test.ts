import { beforeEach, describe, expect, it, vi } from "vitest";
import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { canWriteState } from "../../utils/authorization";
import { validReport } from "../../utils/tests/mockReport";
import { partialUpdateReport } from "./partialUpdate";
import { updateFields } from "../../storage/reports";

vi.mock("../../utils/authentication", () => ({
  authenticatedUser: vi.fn().mockResolvedValue({
    role: UserRoles.STATE_USER,
    state: "PA",
    fullName: "Anthony Soprano",
  }),
}));

vi.mock("../../utils/authorization", () => ({
  canWriteState: vi.fn().mockReturnValue(true),
}));

vi.mock("../../storage/reports", () => ({
  getReport: vi.fn().mockReturnValue(validReport),
  updateFields: vi.fn(),
}));

const report = JSON.stringify(validReport);

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  pathParameters: {
    reportType: "QMS",
    state: "NJ",
    id: "2rRaoAFm8yLB2N2wSkTJ0iRTDu0",
  },
  headers: { "cognito-identity-id": "test" },
  body: report,
};

describe("partialUpdateReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return Bad Request if missing path params", async () => {
    const badTestEvent = {
      ...proxyEvent,
      pathParameters: {},
    } as APIGatewayProxyEvent;
    const res = await partialUpdateReport(badTestEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return Forbidden if user is not authorized", async () => {
    vi.mocked(canWriteState).mockReturnValueOnce(false);
    const response = await partialUpdateReport(testEvent);
    expect(response.statusCode).toBe(StatusCodes.Forbidden);
  });

  it("should return Bad Request if missing body", async () => {
    const emptyBodyEvent = {
      ...proxyEvent,
      pathParameters: { reportType: "QMS", state: "PA", id: "QMSPA123" },
      body: null,
    } as APIGatewayProxyEvent;
    const res = await partialUpdateReport(emptyBodyEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it.each([
    {
      reason: "report type",
      evt: {
        ...proxyEvent,
        pathParameters: { reportType: "ZZ", state: "PA", id: "QMSPA123" },
        body: report,
      },
    },
    {
      reason: "state",
      evt: {
        ...proxyEvent,
        pathParameters: { reportType: "QMS", state: "PA", id: "QMSPA123" },
        body: JSON.stringify({ ...validReport, state: "OR" }),
      },
    },
    {
      reason: "report ID",
      evt: {
        ...proxyEvent,
        pathParameters: { reportType: "QMS", state: "PA", id: "ZZOR1234" },
        body: report,
      },
    },
  ])(
    "should return Bad Request if body does not match path params: $reason",
    async ({ evt }) => {
      const res = await partialUpdateReport(evt);
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
    }
  );

  it("should successfully update a report", async () => {
    const res = await partialUpdateReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(updateFields).toHaveBeenCalled();
  });

  it("should not update non-editable fields", async () => {
    await partialUpdateReport(testEvent);

    expect(updateFields).toHaveBeenCalledWith(
      {
        name: validReport.name,
      },
      "QMS",
      "NJ",
      "2rRaoAFm8yLB2N2wSkTJ0iRTDu0"
    );
  });
});
