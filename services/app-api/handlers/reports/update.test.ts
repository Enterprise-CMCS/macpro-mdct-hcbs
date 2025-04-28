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

jest.mock("../../storage/reports", () => ({
  putReport: () => jest.fn(),
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
    const res = await updateReport(badTestEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return 403 if user is not authorized", async () => {
    (canWriteState as jest.Mock).mockReturnValueOnce(false);
    const response = await updateReport(testEvent);
    expect(response.statusCode).toBe(StatusCodes.Forbidden);
  });

  test("Test missing body", async () => {
    const emptyBodyEvent = {
      ...proxyEvent,
      pathParameters: { reportType: "QMS", state: "PA", id: "QMSPA123" },
      body: null,
    } as APIGatewayProxyEvent;
    const res = await updateReport(emptyBodyEvent);
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

    const resType = await updateReport(badType);
    expect(resType.statusCode).toBe(StatusCodes.BadRequest);
    const resState = await updateReport(badState);
    expect(resState.statusCode).toBe(StatusCodes.BadRequest);
    const resId = await updateReport(badId);
    expect(resId.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test Successful update", async () => {
    const res = await updateReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});

describe("Test update report validation failures", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("throws an error when validating a report with missing state", async () => {
    const missingStateEvent = {
      ...testEvent,
      body: JSON.stringify(missingStateReport),
    };

    const res = await updateReport(missingStateEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });
  test("throws an error when validating a report with incorrect report type", async () => {
    const incorrectReportTypeEvent = {
      ...testEvent,
      body: JSON.stringify(incorrectTypeReport),
    };

    const res = await updateReport(incorrectReportTypeEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });
  test("throws an error when validating invalid form page object", async () => {
    const invalidFormPageEvent = {
      ...testEvent,
      body: JSON.stringify(invalidFormPageReport),
    };

    const res = await updateReport(invalidFormPageEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });
  test("throws an error when validating invalid parent page object", async () => {
    const invalidParentPageEvent = {
      ...testEvent,
      body: JSON.stringify(invalidParentPageReport),
    };

    const res = await updateReport(invalidParentPageEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });
  test("throws an error when validating invalid radio element checked children object", async () => {
    const invalidRadioCheckedChildrenEvent = {
      ...testEvent,
      body: JSON.stringify(invalidRadioCheckedChildrenReport),
    };
    const res = await updateReport(invalidRadioCheckedChildrenEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });
});
