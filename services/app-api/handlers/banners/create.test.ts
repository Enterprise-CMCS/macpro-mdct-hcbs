import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { canWriteAdmin } from "../../utils/authorization";
import { createBanner } from "./create";
import { error } from "../../utils/constants";

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn().mockResolvedValue({
    role: UserRoles.ADMIN,
    state: "PA",
  }),
}));

jest.mock("../../utils/authorization", () => ({
  canWriteAdmin: jest.fn().mockReturnValue(true),
}));

jest.mock("../../storage/banners", () => ({
  putBanner: jest.fn().mockReturnValue({}),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"key":"mock-id","title":"test banner","description":"test description","link":"https://www.mocklink.com","startDate":1000,"endDate":2000}`,
  pathParameters: { bannerId: "testKey" },
  headers: { "cognito-identity-id": "test" },
};

/* TO DO: Add back in when we have validation
const testInvalidEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  body: `{"key":"mock-id","title":"test banner","description":"test description","link":"https://www.mocklink.com","startDate":1000}`,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { bannerId: "testKey" },
};
*/

describe("Test createBanner API method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Test missing path params", async () => {
    const badTestEvent = {
      ...proxyEvent,
      pathParameters: {},
    } as APIGatewayProxyEvent;
    const res = await createBanner(badTestEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  test("Test unauthorized banner creation throws 403 error", async () => {
    (canWriteAdmin as jest.Mock).mockReturnValueOnce(false);
    const res = await createBanner(testEvent);
    expect(res.statusCode).toBe(StatusCodes.Forbidden);
    expect(res.body).toContain(error.UNAUTHORIZED);
  });

  test("Test Successful Run of Banner Creation", async () => {
    const res = await createBanner(testEvent);
    expect(res.statusCode).toBe(StatusCodes.Created);
    expect(res.body).toContain("test banner");
    expect(res.body).toContain("test description");
  });

  /* TO DO: Add back in when we have validation
  test("Test invalid banner payload returns 400", async () => {
    const res = await createBanner(testInvalidEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });
  */

  test("Test bannerKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await createBanner(noKeyEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.MISSING_DATA);
  });

  test("Test bannerKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { bannerId: "" },
    };
    const res = await createBanner(noKeyEvent);
    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.MISSING_DATA);
  });
});
