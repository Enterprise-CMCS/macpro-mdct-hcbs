import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { canWriteState } from "../../utils/authorization";
import { submitReport } from "./submit";

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn().mockResolvedValue({
    role: UserRoles.STATE_USER,
    state: "PA",
  }),
}));

jest.mock("../../utils/authorization", () => ({
  canWriteState: jest.fn().mockReturnValue(true),
}));

jest.mock("../../storage/reports", () => ({
  putReport: () => jest.fn(),
}));

const reportObj = { type: "QMS", state: "PA", id: "QMSPA123" };
const report = JSON.stringify(reportObj);

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  pathParameters: { reportType: "QMS", state: "PA", id: "QMSPA123" },
  headers: { "cognito-identity-id": "test" },
  body: report,
};

describe("Test submit report handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Test missing path params", async () => {
    const badTestEvent = {
      ...proxyEvent,
      pathParameters: {},
    } as APIGatewayProxyEvent;
    const res = await submitReport(badTestEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return 403 if user is not authorized", async () => {
    (canWriteState as jest.Mock).mockReturnValueOnce(false);
    const response = await submitReport(testEvent);
    expect(response.statusCode).toBe(StatusCodes.Forbidden);
  });

  test("Test missing body", async () => {
    const emptyBodyEvent = {
      ...proxyEvent,
      pathParameters: { reportType: "QMS", state: "PA", id: "QMSPA123" },
      body: null,
    } as APIGatewayProxyEvent;
    const res = await submitReport(emptyBodyEvent);
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
      body: JSON.stringify({ ...reportObj, state: "OR" }),
    } as APIGatewayProxyEvent;
    const badId = {
      ...proxyEvent,
      pathParameters: { reportType: "QMS", state: "PA", id: "ZZOR1234" },
      body: report,
    } as APIGatewayProxyEvent;

    const resType = await submitReport(badType);
    expect(resType.statusCode).toBe(StatusCodes.BadRequest);
    const resState = await submitReport(badState);
    expect(resState.statusCode).toBe(StatusCodes.BadRequest);
    const resId = await submitReport(badId);
    expect(resId.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test Successful submit", async () => {
    const res = await submitReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
