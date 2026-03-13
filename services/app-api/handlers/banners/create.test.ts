import { createBanner } from "./create";
import { StatusCodes } from "../../libs/response-lib";
import { APIGatewayProxyEvent, User, UserRoles } from "../../types/types";
import { authenticatedUser as actualAuthenticatedUser } from "../../utils/authentication";
import { BannerAreas, BannerFormData } from "../../types/banner";
import {
  getBanner as actualGetBanner,
  putBanner as actualPutBanner,
} from "../../storage/banners";

jest.mock("../../utils/authentication", () => ({
  authenticatedUser: jest.fn(),
}));
const authenticatedUser = actualAuthenticatedUser as jest.MockedFunction<
  typeof actualAuthenticatedUser
>;
const mockUser = {
  role: UserRoles.ADMIN,
  fullName: "mock username",
} as User;
authenticatedUser.mockReturnValue(mockUser);

jest.mock("../../storage/banners", () => ({
  getBanner: jest.fn(),
  putBanner: jest.fn(),
}));
const getBanner = actualGetBanner as jest.MockedFunction<
  typeof actualGetBanner
>;
const putBanner = actualPutBanner as jest.MockedFunction<
  typeof actualPutBanner
>;

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
    jest.clearAllMocks();
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
    authenticatedUser.mockReturnValueOnce({
      ...mockUser,
      role: UserRoles.STATE_USER,
    });

    const res = await createBanner(mockEvent);

    expect(res.statusCode).toBe(StatusCodes.Forbidden);
  });
});
