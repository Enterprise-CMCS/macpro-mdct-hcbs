import { BannerShape, BannerAreas } from "types/banners";
import { useStore } from "./useStore";
import {
  getBanners as actualGetBanners,
  updateBanner as actualUpdateBanner,
  deleteBanner as actualDeleteBanner,
} from "utils";

jest.mock("utils", () => ({
  getBanners: jest.fn(),
  updateBanner: jest.fn(),
  deleteBanner: jest.fn(),
}));
const getBanners = actualGetBanners as jest.MockedFunction<
  typeof actualGetBanners
>;
const updateBanner = actualUpdateBanner as jest.MockedFunction<
  typeof actualUpdateBanner
>;
const deleteBanner = actualDeleteBanner as jest.MockedFunction<
  typeof actualDeleteBanner
>;

describe("useStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("banner store", () => {
    const mockBanner: BannerShape = {
      key: "889c059a-54fe-4331-8d31-3d8e91665806", // #gitleaks:allow
      area: BannerAreas.Home,
      title: "mock title",
      description: "mock description",
      link: "https://example.com",
      startDate: "2026-03-01",
      endDate: "2026-03-05",
      createdAt: "2026-02-18T13:55:53.735Z",
      lastAltered: "2026-02-18T13:55:53.735Z",
      lastAlteredBy: "mock username",
    };

    it("should update the _lastFetchTime on fetch", async () => {
      useStore.setState({ allBanners: [], _lastFetchTime: 0 });
      getBanners.mockResolvedValueOnce([mockBanner]);

      await useStore.getState().fetchBanners();

      expect(getBanners).toHaveBeenCalled();
      expect(useStore.getState().allBanners).toEqual([mockBanner]);

      const newFetchTime = useStore.getState()._lastFetchTime;
      const now = new Date().valueOf();
      // It's been more than 50 years since Jan 1 1970
      expect(newFetchTime).toBeGreaterThan(1000 * 60 * 60 * 24 * 365 * 50);
      // Hopefully this test took less than 10 seconds to run.
      expect(Math.abs(newFetchTime - now)).toBeLessThan(10000);
    });

    it("should fetch after updating", async () => {
      await useStore.getState().updateBanner(mockBanner);
      expect(updateBanner).toHaveBeenCalled();
      expect(getBanners).toHaveBeenCalled();
    });

    it("should fetch after deleting", async () => {
      await useStore
        .getState()
        .deleteBanner("889c059a-54fe-4331-8d31-3d8e91665806");
      expect(deleteBanner).toHaveBeenCalled();
      expect(getBanners).toHaveBeenCalled();
    });
  });
});
