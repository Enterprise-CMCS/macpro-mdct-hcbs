import { fetchBanner } from "./fetch";
// utils
import { proxyEvent } from "../../testing/proxyEvent";
import { error } from "../../utils/constants";
import { getBanner } from "../../storage/banners";
// types
import { APIGatewayProxyEvent } from "../../types/types";
import { StatusCodes } from "../../libs/response-lib";
import { mockBannerResponse } from "../../testing/setupJest";

jest.mock("../../utils/auth/authorization", () => ({
  isAuthenticated: jest.fn().mockReturnValue(true),
}));

jest.mock("../../storage/banners", () => ({
  getBanner: jest.fn(),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
  pathParameters: { bannerId: "admin-banner-id" },
};

let consoleSpy: {
  debug: jest.SpyInstance<void>;
  error: jest.SpyInstance<void>;
} = {
  debug: jest.fn() as jest.SpyInstance,
  error: jest.fn() as jest.SpyInstance,
};

describe("Test fetchBanner API method", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    consoleSpy.debug = jest.spyOn(console, "debug").mockImplementation();
    consoleSpy.error = jest.spyOn(console, "error").mockImplementation();
  });

  test("Test Successful Banner Fetch", async () => {
    (getBanner as jest.Mock).mockResolvedValueOnce(mockBannerResponse);
    const res = await fetchBanner(testEvent, null);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(res.body).toContain("testDesc");
    expect(res.body).toContain("testTitle");
  });

  test("Test successful empty banner found fetch", async () => {
    (getBanner as jest.Mock).mockResolvedValueOnce(undefined);
    const res = await fetchBanner(testEvent, null);

    expect(consoleSpy.debug).toHaveBeenCalled();
    expect(res.body).not.toBeDefined();
    expect(res.statusCode).toBe(StatusCodes.Ok);
  });

  test("Test bannerKey not provided throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: {},
    };
    const res = await fetchBanner(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });

  test("Test bannerKey empty throws 500 error", async () => {
    const noKeyEvent: APIGatewayProxyEvent = {
      ...testEvent,
      pathParameters: { bannerId: "" },
    };
    const res = await fetchBanner(noKeyEvent, null);

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
    expect(res.body).toContain(error.NO_KEY);
  });
});
