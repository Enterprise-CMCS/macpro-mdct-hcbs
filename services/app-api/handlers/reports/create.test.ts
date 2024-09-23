import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent } from "../../types/types";
import { createReport } from "./create";

jest.mock("../../utils/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

jest.mock("./buildReport", () => ({
  buildReport: jest.fn().mockReturnValue({ id: "A report" }),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  pathParameters: { reportType: "QM", state: "PA" },
  headers: { "cognito-identity-id": "test" },
};

describe("Test create report handler", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  test("Test missing path params", async () => {
    const badTestEvent: APIGatewayProxyEvent = {
      ...proxyEvent,
      headers: { "cognito-identity-id": "test" },
    };
    const res = await createReport(badTestEvent, null);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test Successful create", async () => {
    const res = await createReport(testEvent, null);

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
