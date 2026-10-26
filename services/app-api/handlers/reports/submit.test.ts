import { beforeEach, describe, expect, it, vi } from "vitest";
import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { canWriteState } from "../../utils/authorization";
import { validReport } from "../../utils/tests/mockReport";
import { submitReport } from "./submit";
import { getReport, putReport } from "../../storage/reports";
import { ReportStatus } from "../../types/reports";
import { sendEmail } from "../../utils/notifications/email";
import { getFlag } from "../../libs/launchdarkly-lib";

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
  getReport: vi.fn(),
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
    vi.mocked(getReport).mockResolvedValue(structuredClone(validReport));
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
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        status: ReportStatus.SUBMITTED,
        submittedByEmail: "myname@example.com",
      })
    );
  });

  it("should notify when an unlocked report is resubmitted", async () => {
    vi.mocked(getReport).mockResolvedValueOnce({
      ...validReport,
      status: ReportStatus.IN_PROGRESS,
    });

    const response = await submitReport(testEvent);

    expect(response.statusCode).toBe(StatusCodes.Ok);
    expect(sendEmail).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        status: ReportStatus.SUBMITTED,
        submittedByEmail: "myname@example.com",
      })
    );
  });

  it("should preserve saving but not notify an already submitted stored report", async () => {
    vi.mocked(getReport).mockResolvedValueOnce({
      ...validReport,
      status: ReportStatus.SUBMITTED,
    });
    const res = await submitReport(testEvent);
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(putReport).toHaveBeenCalledWith(
      expect.objectContaining({
        submissionCount: 1,
        submittedByEmail: "myname@example.com",
      })
    );
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("should preserve submission behavior when no stored report is found", async () => {
    vi.mocked(getReport).mockResolvedValueOnce(undefined);
    expect((await submitReport(testEvent)).statusCode).toBe(StatusCodes.Ok);
    expect(putReport).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it("should submit without email when the flag is disabled", async () => {
    vi.mocked(getFlag).mockResolvedValueOnce(false);
    expect((await submitReport(testEvent)).statusCode).toBe(StatusCodes.Ok);
    expect(putReport).toHaveBeenCalledTimes(1);
    expect(sendEmail).not.toHaveBeenCalled();
    expect(getReport).not.toHaveBeenCalled();
  });

  it("should keep a successful submission when email fails", async () => {
    vi.mocked(sendEmail).mockRejectedValueOnce(new Error("SES unavailable"));
    expect((await submitReport(testEvent)).statusCode).toBe(StatusCodes.Ok);
    expect(putReport).toHaveBeenCalledTimes(1);
  });

  it("should save successfully when the notification report lookup fails", async () => {
    vi.mocked(getReport).mockRejectedValueOnce(
      new Error("Could not find all pages for report")
    );

    const response = await submitReport(testEvent);

    expect(response.statusCode).toBe(StatusCodes.Ok);
    expect(putReport).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        status: ReportStatus.SUBMITTED,
        submittedByEmail: "myname@example.com",
      })
    );
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(vi.mocked(putReport).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(sendEmail).mock.invocationCallOrder[0]
    );
  });
});
