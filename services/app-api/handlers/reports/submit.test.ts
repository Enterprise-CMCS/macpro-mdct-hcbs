import { beforeEach, describe, expect, it, vi } from "vitest";
import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { canWriteState } from "../../utils/authorization";
import { validReport } from "../../utils/tests/mockReport";
import { submitReport } from "./submit";
import { putReport } from "../../storage/reports";
import { ReportStatus } from "../../types/reports";

vi.mock("../../libs/launchdarkly-lib", () => ({
  getFlag: vi.fn().mockResolvedValue(true),
}));

vi.mock("../../utils/notifications/email", () => ({
  sendEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../utils/authentication", () => ({
  authenticatedUser: vi.fn().mockResolvedValue({
    role: UserRoles.STATE_USER,
    state: validReport.state,
    fullName: "myname",
    email: "myname@example.com",
  }),
}));

vi.mock("../../utils/authorization", () => ({
  canWriteState: vi.fn().mockReturnValue(true),
}));

vi.mock("../../storage/reports", () => ({
  putReport: vi.fn(),
}));

const invalidReport = JSON.stringify({
  type: "QMS",
  state: "PA",
  id: "QMSPA123",
});

const validPath = {
  reportType: validReport.type,
  state: validReport.state,
  id: validReport.id,
};
const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  pathParameters: validPath,
  headers: { "cognito-identity-id": "test" },
  body: JSON.stringify(validReport),
};

describe("submitReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return Bad Request if missing path params", async () => {
    const badTestEvent = {
      ...proxyEvent,
      pathParameters: {},
    } as APIGatewayProxyEvent;
    const res = await submitReport(badTestEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return Forbidden if user is not authorized", async () => {
    vi.mocked(canWriteState).mockReturnValueOnce(false);
    const response = await submitReport(testEvent);
    expect(response.statusCode).toBe(StatusCodes.Forbidden);
  });

  it("should return Bad Request if missing body", async () => {
    const emptyBodyEvent = {
      ...proxyEvent,
      pathParameters: validPath,
      body: null,
    } as APIGatewayProxyEvent;
    const res = await submitReport(emptyBodyEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return Bad Request if the body contains an invalid report", async () => {
    const emptyBodyEvent = {
      ...proxyEvent,
      pathParameters: validPath,
      body: invalidReport,
    } as APIGatewayProxyEvent;
    const res = await submitReport(emptyBodyEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it.each([
    {
      reason: "report type",
      evt: {
        ...proxyEvent,
        pathParameters: { ...validPath, reportType: "ZZ" },
        body: JSON.stringify(validReport),
      },
    },
    {
      reason: "state",
      evt: {
        ...proxyEvent,
        pathParameters: validPath,
        body: JSON.stringify({ ...validReport, state: "OR" }),
      },
    },
    {
      reason: "report ID",
      evt: {
        ...proxyEvent,
        pathParameters: { ...validPath, id: "ZZOR1234" },
        body: JSON.stringify(validReport),
      },
    },
  ])(
    "should return Bad Request if body does not match path params: $reason",
    async ({ evt }) => {
      const res = await submitReport(evt);
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
    }
  );

  it("should successfully submit a report", async () => {
    const res = await submitReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(putReport).toHaveBeenCalledWith(
      expect.objectContaining({
        // Mostly the report is unchanged
        ...validReport,
        // But we added submit info
        status: ReportStatus.SUBMITTED,
        submissionCount: 1,
        submissionDates: [{ submitted: expect.any(Number) }],
        submitted: expect.any(Number),
        submittedBy: "myname",
        // And we added edit traceability
        lastEdited: expect.any(Number),
        lastEditedBy: "myname",
        lastEditedByEmail: "myname@example.com",
      })
    );
  });
});
