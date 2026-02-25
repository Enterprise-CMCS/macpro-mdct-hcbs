import { getBanners, createBanner, deleteBanner } from "./banner";
import { initAuthManager } from "utils/auth/authLifecycle";
import { BannerAreas, BannerFormData } from "types";

const mockBanner: BannerFormData = {
  title: "QMS Alert",
  area: BannerAreas.QMS,
  description: "mock description",
  link: "https://example.com/qms-alert",
  startDate: "2026-03-01",
  endDate: "2026-03-06",
};

describe("utils/banner", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    initAuthManager();
    jest.runAllTimers();
  });

  describe("getBanner()", () => {
    test("executes", () => {
      expect(getBanners()).toBeTruthy();
    });
  });

  describe("writeBanner()", () => {
    test("executes", () => {
      expect(createBanner(mockBanner)).toBeTruthy();
    });
  });

  describe("deleteBanner()", () => {
    test("executes", () => {
      expect(deleteBanner("mock-banner-key")).toBeTruthy();
    });
  });
});
