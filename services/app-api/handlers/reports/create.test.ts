import { beforeEach, describe, expect, it, vi } from "vitest";
import { StatusCodes } from "../../libs/response-lib";
import { putReport } from "../../storage/reports";
import { UserRoles } from "../../types/types";
import { Report } from "../../types/reports";
import { canWriteState } from "../../utils/authorization";
import { createReport } from "./create";
import { buildReport } from "./buildReport";

vi.mock("../../utils/authentication", () => ({
  authenticatedUser: vi.fn().mockResolvedValue({
    role: UserRoles.STATE_USER,
    state: "PA",
  }),
}));

vi.mock("../../utils/authorization", () => ({
  canWriteState: vi.fn().mockReturnValue(true),
}));

vi.mock("./buildReport", () => ({
  buildReport: vi.fn(),
}));

vi.mock("../../storage/reports", () => ({
  putReport: vi.fn(),
}));

const testEvent = {
  queryStringParameters: {},
  pathParameters: { reportType: "QMS", state: "PA" },
  headers: { "cognito-identity-id": "test" },
  body: JSON.stringify({
    year: 2026,
    name: "test report",
    options: {},
  }),
};

describe("createReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return Bad Request if missing path params", async () => {
    const badTestEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await createReport(badTestEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return Forbidden if user is not authorized", async () => {
    vi.mocked(canWriteState).mockReturnValueOnce(false);
    const response = await createReport(testEvent);
    expect(response.statusCode).toBe(StatusCodes.Forbidden);
  });

  it("should return Bad Request if missing body", async () => {
    const emptyBodyEvent = {
      ...testEvent,
      pathParameters: { reportType: "QMS", state: "PA" },
      body: null,
    };
    const res = await createReport(emptyBodyEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should create a new report and store it", async () => {
    const mockReport = { id: "A report" } as Report;
    vi.mocked(buildReport).mockResolvedValueOnce(mockReport);

    const res = await createReport(testEvent);

    expect(putReport).toHaveBeenCalledWith(mockReport);
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(JSON.parse(res.body!)).toEqual(mockReport);
  });

  it("should return Bad Request if report type is invalid", async () => {
    const invalidDataEvent = {
      ...testEvent,
      pathParameters: { reportType: "BM", state: "NM" },
    };
    const res = await createReport(invalidDataEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });
});
