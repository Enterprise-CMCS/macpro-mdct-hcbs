import { beforeEach, describe, expect, it, vi } from "vitest";
import { createBanner } from "./create";
import { StatusCodes } from "../../libs/response-lib";
import { APIGatewayProxyEvent, User, UserRoles } from "../../types/types";
import { authenticatedUser } from "../../utils/authentication";
import { BannerAreas, BannerFormData } from "../../types/banner";
import { getBanner, putBanner } from "../../storage/banners";

vi.mock("../../utils/authentication", () => ({
  authenticatedUser: vi.fn(),
}));

const mockUser = {
  role: UserRoles.ADMIN,
  fullName: "mock username",
} as User;
vi.mocked(authenticatedUser).mockReturnValue(mockUser);

vi.mock("../../storage/banners", () => ({
  getBanner: vi.fn(),
  putBanner: vi.fn(),
}));

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

const mockBannerFormData: BannerFormData = {
  area: BannerAreas.Home,
  title: "mock title",
  description: "mock description",
  link: "https://example.com",
  startDate: "2026-03-01",
  endDate: "2026-03-06",
};

const mockEvent = {
  body: JSON.stringify(mockBannerFormData),
} as APIGatewayProxyEvent;

describe("createBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should store new banner data in the database", async () => {
    const res = await createBanner(mockEvent);

    expect(res.statusCode).toBe(StatusCodes.Created);
    expect(getBanner).not.toHaveBeenCalled(); // Because the payload has no ID
    expect(putBanner).toHaveBeenCalledWith({
      ...mockBannerFormData,
      key: expect.stringMatching(/^[0-9a-f\-]{36}$/),
      createdAt: expect.stringMatching(ISO_DATE_REGEX),
      lastAltered: expect.stringMatching(ISO_DATE_REGEX),
      lastAlteredBy: "mock username",
    });
  });

  it("should return an error if the request body is not valid", async () => {
    const badEvent = {
      ...mockEvent,
      body: JSON.stringify({
        ...mockBannerFormData,
        link: "invalid url",
      }),
    };

    const res = await createBanner(badEvent);

    expect(res.statusCode).toBe(StatusCodes.BadRequest);
  });

  it("should return an error if the user is not authorized", async () => {
    vi.mocked(authenticatedUser).mockReturnValueOnce({
      ...mockUser,
      role: UserRoles.STATE_USER,
    });

    const res = await createBanner(mockEvent);

    expect(res.statusCode).toBe(StatusCodes.Forbidden);
  });
});
