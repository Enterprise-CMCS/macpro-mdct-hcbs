import { beforeEach, describe, expect, it, vi } from "vitest";
import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { canWriteState } from "../../utils/authorization";
import {
  incorrectTypeReport,
  invalidFormPageReport,
  invalidParentPageReport,
  invalidRadioCheckedChildrenReport,
  missingStateReport,
  validReport,
} from "../../utils/tests/mockReport";
import { updateReport } from "./update";
import { getReport, putReport } from "../../storage/reports";
import { ReportStatus } from "../../types/reports";
import { getFlag } from "../../libs/launchdarkly-lib";
import { sendEmail } from "../../utils/notifications/email";
import { logger } from "../../libs/debug-lib";

vi.mock("../../libs/launchdarkly-lib");
vi.mock("../../utils/notifications/email");
vi.mock("../../libs/debug-lib");

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
  getReport: vi.fn(),
  putReport: vi.fn(),
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

describe("updateReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getFlag).mockResolvedValue(true);
    vi.mocked(getReport).mockResolvedValue({
      ...validReport,
      status: ReportStatus.IN_PROGRESS,
    });
  });

  it("should return Bad Request if missing path params", async () => {
    const badTestEvent = {
      ...proxyEvent,
      pathParameters: {},
    } as APIGatewayProxyEvent;
    const res = await updateReport(badTestEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return Forbidden if user is not authorized", async () => {
    vi.mocked(canWriteState).mockReturnValueOnce(false);
    const response = await updateReport(testEvent);
    expect(response.statusCode).toBe(StatusCodes.Forbidden);
  });

  it("should return Bad Request if missing body", async () => {
    const emptyBodyEvent = {
      ...proxyEvent,
      pathParameters: { reportType: "QMS", state: "PA", id: "QMSPA123" },
      body: null,
    } as APIGatewayProxyEvent;
    const res = await updateReport(emptyBodyEvent);
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
      const res = await updateReport(evt);
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
    }
  );

  it("should successfully update a report", async () => {
    const res = await updateReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(putReport).toHaveBeenCalledWith(
      expect.objectContaining({ status: ReportStatus.IN_PROGRESS })
    );
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("should notify after saving a Submitted to In Progress transition", async () => {
    vi.mocked(getReport).mockResolvedValueOnce({
      ...validReport,
      status: ReportStatus.SUBMITTED,
    });

    const response = await updateReport(testEvent);

    expect(response.statusCode).toBe(StatusCodes.Ok);
    expect(sendEmail).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ status: ReportStatus.IN_PROGRESS })
    );
    expect(vi.mocked(sendEmail).mock.calls[0][0]).toEqual(
      vi.mocked(putReport).mock.calls[0][0]
    );
    expect(vi.mocked(putReport).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(sendEmail).mock.invocationCallOrder[0]
    );
  });

  it("should not notify when a report is first edited", async () => {
    vi.mocked(getReport).mockResolvedValueOnce({
      ...validReport,
      status: ReportStatus.NOT_STARTED,
    });

    expect((await updateReport(testEvent)).statusCode).toBe(StatusCodes.Ok);
    expect(putReport).toHaveBeenCalledTimes(1);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("should skip notification lookup and sending when disabled", async () => {
    vi.mocked(getFlag).mockResolvedValueOnce(false);

    expect((await updateReport(testEvent)).statusCode).toBe(StatusCodes.Ok);
    expect(putReport).toHaveBeenCalledTimes(1);
    expect(getReport).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("should still save when the notification lookup fails", async () => {
    const error = new Error("Lookup unavailable");
    vi.mocked(getReport).mockRejectedValueOnce(error);

    expect((await updateReport(testEvent)).statusCode).toBe(StatusCodes.Ok);
    expect(putReport).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(error);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("should not notify when the previous status is unknown", async () => {
    vi.mocked(getReport).mockResolvedValueOnce(undefined);

    expect((await updateReport(testEvent)).statusCode).toBe(StatusCodes.Ok);
    expect(putReport).toHaveBeenCalledTimes(1);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("should preserve a successful update when notification delivery fails", async () => {
    const error = new Error("SES unavailable");
    vi.mocked(getReport).mockResolvedValueOnce({
      ...validReport,
      status: ReportStatus.SUBMITTED,
    });
    vi.mocked(sendEmail).mockRejectedValueOnce(error);

    expect((await updateReport(testEvent)).statusCode).toBe(StatusCodes.Ok);
    expect(putReport).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(error);
  });

  it("should reject submitting a report through the update endpoint", async () => {
    const response = await updateReport({
      ...testEvent,
      body: JSON.stringify({ ...validReport, status: ReportStatus.SUBMITTED }),
    });

    expect(response.statusCode).toBe(StatusCodes.BadRequest);
    expect(putReport).not.toHaveBeenCalled();
  });

  describe("Report validation failures", () => {
    it("should throw an error when validating a report with missing state", async () => {
      const missingStateEvent = {
        ...testEvent,
        body: JSON.stringify(missingStateReport),
      };

      const res = await updateReport(missingStateEvent);
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
    });

    it("should throw an error when validating a report with incorrect report type", async () => {
      const incorrectReportTypeEvent = {
        ...testEvent,
        body: JSON.stringify(incorrectTypeReport),
      };

      const res = await updateReport(incorrectReportTypeEvent);
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
    });

    it("should throw an error when validating invalid form page object", async () => {
      const invalidFormPageEvent = {
        ...testEvent,
        body: JSON.stringify(invalidFormPageReport),
      };

      const res = await updateReport(invalidFormPageEvent);
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
    });

    it("should throw an error when validating invalid parent page object", async () => {
      const invalidParentPageEvent = {
        ...testEvent,
        body: JSON.stringify(invalidParentPageReport),
      };

      const res = await updateReport(invalidParentPageEvent);
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
    });

    it("should throw an error when validating invalid radio element checked children object", async () => {
      const invalidRadioCheckedChildrenEvent = {
        ...testEvent,
        body: JSON.stringify(invalidRadioCheckedChildrenReport),
      };
      const res = await updateReport(invalidRadioCheckedChildrenEvent);
      expect(res.statusCode).toBe(StatusCodes.BadRequest);
    });
  });
});
