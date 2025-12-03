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
    reportType: "XYZ",
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

  test("missing path params", async () => {
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

  test("missing body", async () => {
    const emptyBodyEvent = {
      ...proxyEvent,
      pathParameters: { reportType: "XYZ", state: "PA", id: "XYZPA123" },
      body: null,
    } as APIGatewayProxyEvent;
    const res = await partialUpdateReport(emptyBodyEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("body + param mismatch", async () => {
    const badType = {
      ...proxyEvent,
      pathParameters: { reportType: "ZZ", state: "PA", id: "XYZPA123" },
      body: report,
    } as APIGatewayProxyEvent;
    const badState = {
      ...proxyEvent,
      pathParameters: { reportType: "XYZ", state: "PA", id: "XYZPA123" },
      body: JSON.stringify({ ...validReport, state: "OR" }),
    } as APIGatewayProxyEvent;
    const badId = {
      ...proxyEvent,
      pathParameters: { reportType: "XYZ", state: "PA", id: "ZZOR1234" },
      body: report,
    } as APIGatewayProxyEvent;

    const resType = await partialUpdateReport(badType);
    expect(resType.statusCode).toBe(StatusCodes.BadRequest);
    const resState = await partialUpdateReport(badState);
    expect(resState.statusCode).toBe(StatusCodes.BadRequest);
    const resId = await partialUpdateReport(badId);
    expect(resId.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Successful update", async () => {
    const res = await partialUpdateReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });

  test("validation strips everything not editable", async () => {
    await partialUpdateReport(testEvent);

    expect(mockUpdateFields).toHaveBeenCalledWith(
      {
        name: validReport.name,
      },
      "XYZ",
      "NJ",
      "2rRaoAFm8yLB2N2wSkTJ0iRTDu0"
    );
  });
});
