import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { releaseReport } from "./release";
import { canWriteBanner } from "../../utils/authorization";
import { getReport } from "../../storage/reports";
import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { validReport } from "../../utils/tests/mockReport";

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn().mockResolvedValue({
    role: UserRoles.ADMIN,
    state: "PA",
  }),
}));

jest.mock("../../utils/authorization", () => ({
  canWriteBanner: jest.fn().mockReturnValue(true),
}));

const getReportMock = jest
  .fn()
  .mockReturnValue({ id: "A report", locked: true });

jest.mock("../../storage/reports", () => ({
  getReport: () => getReportMock(),
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
    (canWriteBanner as jest.Mock).mockReturnValueOnce(false);
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
    getReportMock.mockReturnValueOnce({
      id: "A report",
      locked: true,
      archived: true,
    });
    const res = await releaseReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Forbidden);
  });

  test("Test unlocked report", async () => {
    getReportMock.mockReturnValueOnce({ id: "A report", locked: false });
    const res = await releaseReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
  test("Test successful lock of report", async () => {
    const res = await releaseReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
