import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { LiteReport, ReportType } from "../../types/reports";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { canWriteState } from "../../utils/authorization";
import { StateAbbr } from "../../utils/constants";
import { validReport } from "../../utils/tests/mockReport";
import { partialUpdateReport } from "./partialUpdate";

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn().mockResolvedValue({
    role: UserRoles.STATE_USER,
    state: "PA",
    fullName: "Anthony Soprano",
  }),
}));

jest.mock("../../utils/authorization", () => ({
  canWriteState: jest.fn().mockReturnValue(true),
}));

const mockUpdateFields = jest.fn();
jest.mock("../../storage/reports", () => ({
  getReport: jest.fn().mockReturnValue(validReport),
  updateFields: (
    fieldsToUpdate: Partial<LiteReport>,
    reportType: ReportType,
    state: StateAbbr,
    id: string
  ) => mockUpdateFields(fieldsToUpdate, reportType, state, id),
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

describe("Test update report handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Test missing path params", async () => {
    const badTestEvent = {
      ...proxyEvent,
      pathParameters: {},
    } as APIGatewayProxyEvent;
    const res = await partialUpdateReport(badTestEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return 403 if user is not authorized", async () => {
    (canWriteState as jest.Mock).mockReturnValueOnce(false);
    const response = await partialUpdateReport(testEvent);
    expect(response.statusCode).toBe(StatusCodes.Forbidden);
  });

  test("Test missing body", async () => {
    const emptyBodyEvent = {
      ...proxyEvent,
      pathParameters: { reportType: "QMS", state: "PA", id: "QMSPA123" },
      body: null,
    } as APIGatewayProxyEvent;
    const res = await partialUpdateReport(emptyBodyEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test body + param mismatch", async () => {
    const badType = {
      ...proxyEvent,
      pathParameters: { reportType: "ZZ", state: "PA", id: "QMSPA123" },
      body: report,
    } as APIGatewayProxyEvent;
    const badState = {
      ...proxyEvent,
      pathParameters: { reportType: "QMS", state: "PA", id: "QMSPA123" },
      body: JSON.stringify({ ...validReport, state: "OR" }),
    } as APIGatewayProxyEvent;
    const badId = {
      ...proxyEvent,
      pathParameters: { reportType: "QMS", state: "PA", id: "ZZOR1234" },
      body: report,
    } as APIGatewayProxyEvent;

    const resType = await partialUpdateReport(badType);
    expect(resType.statusCode).toBe(StatusCodes.BadRequest);
    const resState = await partialUpdateReport(badState);
    expect(resState.statusCode).toBe(StatusCodes.BadRequest);
    const resId = await partialUpdateReport(badId);
    expect(resId.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test Successful update", async () => {
    const res = await partialUpdateReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });

  test("Test validation strips everything not editable", async () => {
    await partialUpdateReport(testEvent);

    expect(mockUpdateFields).toHaveBeenCalledWith(
      {
        name: validReport.name,
      },
      "QMS",
      "NJ",
      "2rRaoAFm8yLB2N2wSkTJ0iRTDu0"
    );
  });
});
