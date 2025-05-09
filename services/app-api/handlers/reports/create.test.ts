import { StatusCodes } from "../../libs/response-lib";
import { putReport } from "../../storage/reports";
import { UserRoles } from "../../types/types";
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

jest.mock("../../storage/reports", () => ({
  putReport: jest.fn(),
}));

jest.mock("../../storage/reports", () => ({
  putReport: jest.fn(),
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

describe("Test create report handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Test missing path params", async () => {
    const badTestEvent = {
      ...testEvent,
      pathParameters: {},
    };
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
      ...testEvent,
      pathParameters: { reportType: "QMS", state: "PA" },
      body: null,
    };
    const res = await createReport(emptyBodyEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test Successful create", async () => {
    const res = await createReport(testEvent);

    expect(putReport).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});

test("Test invalid report type", async () => {
  const invalidDataEvent = {
    ...testEvent,
    pathParameters: { reportType: "BM", state: "NM" },
  };
  const res = await createReport(invalidDataEvent);
  expect(res.statusCode).toBe(StatusCodes.BadRequest);
});
