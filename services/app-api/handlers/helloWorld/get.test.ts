import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, StatusCodes } from "../../types";
import { getHelloWorld } from "./get";

jest.mock("../../utils/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
};

describe("Test hello world API method", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  test("Test Successful get hello world", async () => {
    const res = await getHelloWorld(testEvent, null);

    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(res.body).toContain("Hello World!");
  });
});
