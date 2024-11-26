import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { canWriteState } from "../../utils/authorization";
import { createReport } from "./create";

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn().mockResolvedValue({
    role: UserRoles.STATE_USER,
    state: "PA",
  }),
}));

jest.mock("../../utils/authorization", () => ({
  canWriteState: jest.fn().mockReturnValue(true),
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
    jest.clearAllMocks();
  });

  test("Test missing path params", async () => {
    const badTestEvent = {
      ...proxyEvent,
      pathParameters: {},
    } as APIGatewayProxyEvent;
    const res = await createReport(badTestEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return 403 if user is not authorized", async () => {
    (canWriteState as jest.Mock).mockReturnValueOnce(false);
    const response = await createReport(testEvent);
    expect(response.statusCode).toBe(StatusCodes.Forbidden);
  });

  test("Test missing body", async () => {
    const emptyBodyEvent = {
      ...proxyEvent,
      pathParameters: { reportType: "QM", state: "PA" },
      body: null,
    } as APIGatewayProxyEvent;
    const res = await createReport(emptyBodyEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test Successful create", async () => {
    const res = await createReport(testEvent);

    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
