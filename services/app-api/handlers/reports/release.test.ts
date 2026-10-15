import { beforeEach, describe, expect, it, vi } from "vitest";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { releaseReport } from "./release";
import { canReleaseReport } from "../../utils/authorization";
import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { validReport } from "../../utils/tests/mockReport";
import { Report, ReportStatus } from "../../types/reports";
import { getFlag } from "../../libs/launchdarkly-lib";
import { sendEmail } from "../../utils/notifications/email";
import { getReport } from "../../storage/reports";

vi.mock("../../libs/launchdarkly-lib", () => ({
  getFlag: vi.fn().mockResolvedValue(true),
}));

vi.mock("../../utils/notifications/email", () => ({
  sendEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../utils/authentication", () => ({
  authenticatedUser: vi.fn().mockResolvedValue({
    role: UserRoles.ADMIN,
  }),
}));

vi.mock("../../utils/authorization", () => ({
  canReleaseReport: vi.fn().mockReturnValue(true),
}));

vi.mock("../../storage/reports", () => ({
  getReport: vi.fn(),
  putReport: vi.fn(),
}));
vi.mocked(getReport).mockResolvedValue({
  id: "A report",
  status: ReportStatus.SUBMITTED,
  name: "name",
} as Report);

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

describe("releaseReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return Bad Request if missing path params", async () => {
    const badTestEvent = {
      ...proxyEvent,
      pathParameters: {},
    } as APIGatewayProxyEvent;
    const res = await releaseReport(badTestEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return Forbidden if user is not authorized", async () => {
    vi.mocked(canReleaseReport).mockReturnValueOnce(false);
    const response = await releaseReport(testEvent);
    expect(response.statusCode).toBe(StatusCodes.Forbidden);
  });

  it("should return Bad Request if missing body", async () => {
    const emptyBodyEvent = {
      ...proxyEvent,
      pathParameters: { reportType: "QMS", state: "PA", id: "QMSPA123" },
      body: null,
    } as APIGatewayProxyEvent;
    const res = await releaseReport(emptyBodyEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return Forbidden if the report is archived", async () => {
    vi.mocked(getReport).mockResolvedValueOnce({
      id: "A report",
      archived: true,
      status: ReportStatus.SUBMITTED,
    } as Report);
    const res = await releaseReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Forbidden);
  });

  it("should succeed on an already-released report", async () => {
    vi.mocked(getReport).mockResolvedValueOnce({
      id: "A report",
      status: ReportStatus.IN_PROGRESS,
    } as Report);
    const res = await releaseReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });

  it("should un-submit a submitted report", async () => {
    const res = await releaseReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });

  it("should not send an email on unlock if the email flag is off", async () => {
    vi.mocked(getFlag).mockResolvedValueOnce(false);

    const res = await releaseReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
