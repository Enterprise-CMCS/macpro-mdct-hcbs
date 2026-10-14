import { beforeEach, describe, expect, it, vi } from "vitest";
import { ok, StatusCodes } from "../../libs/response-lib";
import { getReport } from "../../storage/reports";
import { Report, ReportStatus, ReportType } from "../../types/reports";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { canWriteState } from "../../utils/authorization";
import { addQipTargetPage } from "./addQipTargetPage";
import { patchReport } from "./patch";

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
}));
const testReport = {
  type: ReportType.QIP,
  id: "2rRaoAFm8yLB2N2wSkTJ0iRTDu0",
  state: "CO",
  status: ReportStatus.IN_PROGRESS,
} as Report;
vi.mocked(getReport).mockResolvedValue(testReport);

vi.mock("./addQipTargetPage", () => ({
  addQipTargetPage: vi.fn(),
}));

const testEvent = {
  pathParameters: {
    reportType: "QIP",
    state: "CO",
    id: "2rRaoAFm8yLB2N2wSkTJ0iRTDu0",
  } as Record<string, string | null>,
  // headers: { "cognito-identity-id": "test" } as Record<string, string | null>,
  body: JSON.stringify({ patchType: "addQipTargetPage" }),
} as APIGatewayProxyEvent;

describe("Test update report handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return Bad Request if path parameters are missing", async () => {
    const badTestEvent = { ...testEvent, pathParameters: {} };
    const res = await patchReport(badTestEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return Forbidden if user is not authorized", async () => {
    vi.mocked(canWriteState).mockReturnValueOnce(false);
    const response = await patchReport(testEvent);
    expect(response.statusCode).toBe(StatusCodes.Forbidden);
  });

  it("should return Bad Request if body is missing", async () => {
    const emptyBodyEvent = { ...testEvent, body: null };
    const res = await patchReport(emptyBodyEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return Not Found if report is not in the database", async () => {
    vi.mocked(getReport).mockResolvedValueOnce(undefined);
    const res = await patchReport(testEvent);
    expect(res.statusCode).toBe(StatusCodes.NotFound);
  });

  it("should return Conflict if report is not editable", async () => {
    vi.mocked(getReport).mockResolvedValueOnce({
      ...testReport,
      status: ReportStatus.SUBMITTED,
    });
    const res = await patchReport(testEvent);
    expect(res.statusCode).toBe(StatusCodes.Conflict);
  });

  it("should return Bad Request if patch type is missing", async () => {
    const res = await patchReport({ ...testEvent, body: "{}" });
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return Bad Request if patch type is invalid", async () => {
    const res = await patchReport({ ...testEvent, body: `{"patchType":"no"}` });
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should forward calls to addQipTargetPage", async () => {
    vi.mocked(addQipTargetPage).mockResolvedValue(ok("Page added"));
    const res = await patchReport(testEvent);
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(res.body).toBe(`"Page added"`);
  });
});
