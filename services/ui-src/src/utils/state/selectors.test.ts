import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  activeBannerSelector,
  currentPageSelector,
  submittableMetricsSelector,
} from "./selectors";
import {
  BannerShape,
  BannerAreas,
  PageStatus,
  HcbsReportState,
  ElementType,
} from "types";
import { useStore } from "./useStore";

vi.mock("utils", () => ({
  getBanners: vi.fn(),
  createBanner: vi.fn(),
  deleteBanner: vi.fn(),
}));

describe("Selectors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCurrentPage", () => {
    it("should return the current page object", async () => {
      const mockStoreState = {
        currentPageId: "page-1",
        report: { pages: [{ id: "root" }, { id: "page-1" }, { id: "page-2" }] },
        pageMap: new Map([
          ["root", 0],
          ["page-1", 1],
          ["page-2", 2],
        ]),
      } as HcbsReportState;

      const page = currentPageSelector(mockStoreState);

      expect(page).toBe(mockStoreState.report!.pages[1]);
    });
  });

  describe("submittableMetricsSelector", () => {
    it("should return the readiness of the report", async () => {
      const mockStoreState = {
        report: {
          pages: [
            { id: "root", childPageIds: ["page-1", "page-2"] },
            {
              id: "page-1",
              elements: [
                {
                  type: ElementType.Textbox,
                  required: true,
                  answer: "completed element",
                },
                {
                  type: ElementType.Textbox,
                  required: true,
                  answer: undefined, //incomplete element
                },
              ],
            },
            { id: "page-2" },
          ],
        },
        pageMap: new Map([
          ["root", 0],
          ["page-1", 1],
          ["page-2", 2],
        ]),
      } as HcbsReportState;
      const result = submittableMetricsSelector(mockStoreState);

      expect(result?.sections[0]?.submittable).toEqual(false);
      expect(result?.sections[0]?.displayStatus).toEqual(
        PageStatus.IN_PROGRESS
      );
      expect(result?.submittable).toEqual(false);
    });
  });

  describe("activeBannerSelector", () => {
    const daysAfterNow = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toISOString().slice(0, 10);
    };

    it("should return the active banner for the given area", () => {
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
      const banner = selector(useStore.getState());

      expect(banner).toBe(present);
    });

    it("should return undefined if there is no active banner for the given area", () => {
      const past = {
        area: BannerAreas.Home,
        startDate: daysAfterNow(-5),
        endDate: daysAfterNow(-2),
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
      useStore.setState({ allBanners: [past, future, elsewhere] });

      const selector = activeBannerSelector(BannerAreas.Home);
      const banner = selector(useStore.getState());

      expect(banner).toBeUndefined();
    });

    it("should kick off a fetch if the data is old", () => {
      const mockFetch = vi.fn();
      useStore.setState({
        allBanners: [],
        _lastFetchTime: 0,
        fetchBanners: mockFetch,
      });

      const selector = activeBannerSelector(BannerAreas.Home);
      const _banners = selector(useStore.getState());

      expect(mockFetch).toHaveBeenCalled();
    });

    it("should NOT kick off a fetch if the data is new", () => {
      const mockFetch = vi.fn();
      useStore.setState({
        allBanners: [],
        _lastFetchTime: Date.now(),
        fetchBanners: mockFetch,
      });

      const selector = activeBannerSelector(BannerAreas.Home);
      const _banners = selector(useStore.getState());

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
