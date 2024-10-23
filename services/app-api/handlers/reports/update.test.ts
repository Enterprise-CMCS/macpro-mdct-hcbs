import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent } from "../../types/types";
import { updateReport } from "./update";

jest.mock("../../utils/authorization", () => ({
  isAuthenticated: jest.fn().mockResolvedValue(true),
}));

jest.mock("../../storage/reports", () => ({
  putReport: () => jest.fn(),
}));

const reportObj = { type: "QM", state: "PA", id: "QMPA123" };
const report = JSON.stringify(reportObj);

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  pathParameters: { reportType: "QM", state: "PA", id: "QMPA123" },
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
    const res = await updateReport(badTestEvent, null);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test missing body", async () => {
    const emptyBodyEvent = {
      ...proxyEvent,
      pathParameters: { reportType: "QM", state: "PA", id: "QMPA123" },
      body: null,
    } as APIGatewayProxyEvent;
    const res = await updateReport(emptyBodyEvent, null);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test body + param mismatch", async () => {
    const badType = {
      ...proxyEvent,
      pathParameters: { reportType: "ZZ", state: "PA", id: "QMPA123" },
      body: report,
    } as APIGatewayProxyEvent;
    const badState = {
      ...proxyEvent,
      pathParameters: { reportType: "QM", state: "OR", id: "QMPA123" },
      body: report,
    } as APIGatewayProxyEvent;
    const badId = {
      ...proxyEvent,
      pathParameters: { reportType: "QM", state: "PA", id: "ZZOR1234" },
      body: report,
    } as APIGatewayProxyEvent;

    const resType = await updateReport(badType, null);
    expect(resType.statusCode).toBe(StatusCodes.BadRequest);
    const resState = await updateReport(badState, null);
    expect(resState.statusCode).toBe(StatusCodes.BadRequest);
    const resId = await updateReport(badId, null);
    expect(resId.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test Successful update", async () => {
    const res = await updateReport(testEvent, null);

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
