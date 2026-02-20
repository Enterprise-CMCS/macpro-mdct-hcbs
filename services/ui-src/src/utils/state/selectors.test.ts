import { mockUseStore } from "utils/testing/setupJest";
import {
  activeBannerSelector,
  currentPageSelector,
  submittableMetricsSelector,
} from "./selectors";
import { BannerShape, BannerAreas, PageStatus } from "types";
import { useStore } from "./useStore";

jest.mock("utils", () => ({
  getBanners: jest.fn(),
  updateBanner: jest.fn(),
  deleteBanner: jest.fn(),
}));

describe("Selectors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getCurrentPage should return the current page object", async () => {
    const page = currentPageSelector(mockUseStore);

    expect(page?.id).toEqual(mockUseStore.currentPageId);
  });

  test("submittableMetricsSelector should return the readiness of the report", async () => {
    const result = submittableMetricsSelector(mockUseStore);

    expect(result?.sections[0]?.submittable).toEqual(false);
    expect(result?.sections[0]?.displayStatus).toEqual(PageStatus.IN_PROGRESS);
    expect(result?.submittable).toEqual(false);
  });

  describe("activeBannerSelector", () => {
    const daysAfterNow = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toISOString();
    };

    it("should return active banners for the given area", () => {
      const past = {
        area: BannerAreas.Home,
        startDate: daysAfterNow(-5),
        endDate: daysAfterNow(-2),
      } as BannerShape;
      const present = {
        area: BannerAreas.Home,
        startDate: daysAfterNow(-2),
        endDate: daysAfterNow(5),
      } as BannerShape;
      const future = {
        area: BannerAreas.Home,
        startDate: daysAfterNow(5),
        endDate: daysAfterNow(12),
      } as BannerShape;
      const elsewhere = {
        area: BannerAreas.QMS,
        startDate: daysAfterNow(-2),
        endDate: daysAfterNow(5),
      } as BannerShape;
      useStore.setState({ allBanners: [past, present, future, elsewhere] });

      const selector = activeBannerSelector(BannerAreas.Home);
      const banners = selector(useStore.getState());

      expect(banners).toEqual([present]);
    });

    it("should kick off a fetch if the data is old", () => {
      const mockFetch = jest.fn();
      useStore.setState({
        allBanners: [],
        _lastFetchTime: 0,
        fetchBanners: mockFetch,
      });

      const selector = activeBannerSelector(BannerAreas.Home);
      const _banners = selector(useStore.getState());

      expect(mockFetch).toHaveBeenCalled();
    });

    it("should NOT kick off a fetch if the data is old", () => {
      const mockFetch = jest.fn();
      useStore.setState({
        allBanners: [],
        _lastFetchTime: new Date().valueOf(),
        fetchBanners: mockFetch,
      });

      const selector = activeBannerSelector(BannerAreas.Home);
      const _banners = selector(useStore.getState());

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
