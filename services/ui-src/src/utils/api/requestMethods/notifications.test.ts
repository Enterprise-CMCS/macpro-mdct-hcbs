import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateTimeout } from "../../auth/authLifecycle";
import { ReportType } from "types";
import { getNotifications, updateNotifications } from "./notifications";
import { apiLib } from "../apiLib";

vi.mock("../apiLib", () => ({
  apiLib: {
    del: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock("../../auth/authLifecycle", () => ({
  updateTimeout: vi.fn(),
}));

describe("utils/notifications", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
  });

  describe("getNotifications()", () => {
    it("should call the correct endpoint", async () => {
      await getNotifications();
      expect(vi.mocked(updateTimeout)).toHaveBeenCalled();
      expect(vi.mocked(apiLib.get)).toHaveBeenCalledWith(
        "/notifications",
        expect.any(Object)
      );
    });
  });

  describe("updateNotifications()", () => {
    it("should call the correct endpoint", async () => {
      await updateNotifications({ category: ReportType.CI, enabled: true });
      expect(vi.mocked(updateTimeout)).toHaveBeenCalled();
      expect(vi.mocked(apiLib.put)).toHaveBeenCalledWith(
        "/notifications",
        expect.objectContaining({
          body: { category: ReportType.CI, enabled: true },
        })
      );
    });
  });
});
