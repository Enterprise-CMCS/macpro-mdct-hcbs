import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { releaseReport } from "./release";
import { canReleaseReport } from "../../utils/authorization";
import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { validReport } from "../../utils/tests/mockReport";
import { ReportStatus } from "../../types/reports";

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn().mockResolvedValue({
    role: UserRoles.ADMIN,
  }),
}));

jest.mock("../../utils/authorization", () => ({
  canReleaseReport: jest.fn().mockReturnValue(true),
}));

const mockGet = jest.fn().mockReturnValue({
  id: "A report",
  status: ReportStatus.SUBMITTED,
  name: "name",
});

jest.mock("../../storage/reports", () => ({
  getReport: () => mockGet(),
  putReport: jest.fn(),
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

describe("Test releaseReport handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Test missing path params", async () => {
    const badTestEvent = {
      ...proxyEvent,
      pathParameters: {},
    } as APIGatewayProxyEvent;
    const res = await releaseReport(badTestEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return 403 if user is not authorized", async () => {
    (canReleaseReport as jest.Mock).mockReturnValueOnce(false);
    const response = await releaseReport(testEvent);
    expect(response.statusCode).toBe(StatusCodes.Forbidden);
  });

  test("Test missing body", async () => {
    const emptyBodyEvent = {
      ...proxyEvent,
      pathParameters: { reportType: "QMS", state: "PA", id: "QMSPA123" },
      body: null,
    } as APIGatewayProxyEvent;
    const res = await releaseReport(emptyBodyEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test archived report", async () => {
    mockGet.mockReturnValueOnce({
      id: "A report",
      archived: true,
      status: ReportStatus.SUBMITTED,
    });
    const res = await releaseReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Forbidden);
  });

  test("Test unlocked report", async () => {
    mockGet.mockReturnValueOnce({
      id: "A report",
      status: ReportStatus.SUBMITTED,
    });
    const res = await releaseReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
  test("Test successful lock of report", async () => {
    const res = await releaseReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
