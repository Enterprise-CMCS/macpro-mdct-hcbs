import { isReportType } from "./reports";

describe("Report type utilities", () => {
  describe("isReportType", () => {
    it("should accept valid report types", () => {
      expect(isReportType("QMS")).toBe(true);
    });

    it("should reject unknown report types", () => {
      expect(isReportType("Colorado")).toBe(false);
    });
  });
});
