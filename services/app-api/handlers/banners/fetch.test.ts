import { StatusCodes } from "../../libs/response-lib";
import { proxyEvent } from "../../testing/proxyEvent";
import { APIGatewayProxyEvent, UserRoles } from "../../types/types";
import { listBanners } from "./fetch";
import { scanAllBanners } from "../../storage/banners";
import { BannerShape, BannerAreas } from "../../types/banner";

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn().mockResolvedValue({
    role: UserRoles.ADMIN,
    state: "PA",
  }),
}));

jest.mock("../../utils/authorization", () => ({
  isAuthenticated: jest.fn().mockReturnValue(true),
}));

jest.mock("../../storage/banners", () => ({
  scanAllBanners: jest.fn(),
}));

const testEvent: APIGatewayProxyEvent = {
  ...proxyEvent,
  headers: { "cognito-identity-id": "test" },
};

const mockBanner: BannerShape = {
  key: "889c059a-54fe-4331-8d31-3d8e91665806", // #gitleaks:allow
  area: BannerAreas.Home,
  title: "mock title",
  description: "mock description",
  link: "https://example.com",
  startDate: "2026-03-01T05:00:00.000Z",
  endDate: "2026-03-06T04:59:59.000Z",
  createdAt: "2026-02-18T13:55:53.735Z",
  lastAltered: "2026-02-18T13:55:53.735Z",
  lastAlteredBy: "mock username",
};

describe("listBanners", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should query Dynamo for banner data", async () => {
    (scanAllBanners as jest.Mock).mockResolvedValueOnce([mockBanner]);
    const res = await listBanners(testEvent);
    expect(res.statusCode).toBe(StatusCodes.Ok);
    expect(JSON.parse(res.body!)).toEqual([mockBanner]);
  });

  it("should return an empty array if no banners exist", async () => {
    (scanAllBanners as jest.Mock).mockResolvedValueOnce([]);
    const res = await listBanners(testEvent);
    expect(res.body).toBe("[]");
    expect(res.statusCode).toBe(StatusCodes.Ok);
  });
});
