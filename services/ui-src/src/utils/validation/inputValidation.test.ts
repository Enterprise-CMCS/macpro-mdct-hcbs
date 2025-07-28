import { isUrl } from "./inputValidation";

describe("Input validation utilities", () => {
  describe("isUrl()", () => {
    it("should reject undefined", () => {
      expect(isUrl(undefined)).toBe(false);
    });

    it("should reject the empty string", () => {
      expect(isUrl("")).toBe(false);
    });

    it.each([
      { input: "hello" },
      { input: "www.cms.gov" },
      { input: "javascript:void(0)" },
      { input: "ftp://www.example.com" },
    ])("should reject the string '$input'", ({ input }) => {
      expect(isUrl(input)).toBe(false);
    });

    it.each([
      { input: "https://www.cms.gov" },
      { input: "http://www.cms.gov" },
    ])("should accept the string '$input'", ({ input }) => {
      expect(isUrl(input)).toBe(true);
    });
  });
});
