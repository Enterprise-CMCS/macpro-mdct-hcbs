import { beforeEach, describe, expect, it, vi } from "vitest";
import { getBanners, createBanner, deleteBanner } from "./banner";
import { apiLib } from "../apiLib";
import { updateTimeout } from "../../auth/authLifecycle";
import { BannerAreas, BannerFormData } from "types";

const mockBanner: BannerFormData = {
  title: "QMS Alert",
  area: BannerAreas.QMS,
  description: "mock description",
  link: "https://example.com/qms-alert",
  startDate: "2026-03-01",
  endDate: "2026-03-06",
};

vi.mock("../apiLib", () => ({
  apiLib: {
    get: vi.fn(),
    post: vi.fn(),
    del: vi.fn(),
  },
}));

vi.mock("../../auth/authLifecycle", () => ({
  updateTimeout: vi.fn(),
}));

describe("Banner request methods", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
  });

  describe("getBanners", () => {
    it("should call the correct endpoint", async () => {
      await getBanners();
      expect(vi.mocked(updateTimeout)).toHaveBeenCalled();
      expect(vi.mocked(apiLib.get)).toHaveBeenCalledWith(
        "/banners",
        expect.any(Object)
      );
    });
  });

  describe("createBanner", () => {
    it("should call the correct endpoint", async () => {
      await createBanner(mockBanner);
      expect(vi.mocked(updateTimeout)).toHaveBeenCalled();
      expect(vi.mocked(apiLib.post)).toHaveBeenCalledWith(
        "/banners",
        expect.objectContaining({ body: mockBanner })
      );
    });
  });

  describe("deleteBanner", () => {
    it("should call the correct endpoint", async () => {
      await deleteBanner("mock-id");
      expect(vi.mocked(updateTimeout)).toHaveBeenCalled();
      expect(vi.mocked(apiLib.del)).toHaveBeenCalledWith(
        "/banners/mock-id",
        expect.any(Object)
      );
    });
  });
});
