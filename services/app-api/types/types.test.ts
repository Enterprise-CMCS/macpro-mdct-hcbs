import {
  isIsoDateString,
  isIsoDateTimeString,
  isUserRole,
  isValidUrl,
} from "./types";

describe("type utilities", () => {
  describe("isUserRole", () => {
    it.each([
      "mdcthcbs-bor",
      "mdcthcbs-appr",
      "mdcthcbs-hd",
      "mdcthcbs-internal-user",
      "mdcthcbs-state-user",
    ])("should accept the value %s", (value) => {
      expect(isUserRole(value)).toBe(true);
    });

    it.each(["", "not-a-role", "mdcthcbs-1080p"])(
      "should reject the value %s",
      (value) => {
        expect(isUserRole(value)).toBe(false);
      }
    );
  });

  describe("isValidUrl", () => {
    it.each([
      "https://www.cms.gov",
      "http://www.cms.gov",
      "http://192.168.0.0/a/b?c=d&e=f#g",
    ])("should accept the value %s", (value) => {
      expect(isValidUrl(value)).toBe(true);
    });

    it.each([
      null,
      undefined,
      "",
      "hello",
      "www.cms.gov",
      "javascript:void(0)",
      "ftp://www.example.com",
    ])("should reject the value %s", (value) => {
      expect(isValidUrl(value)).toBe(false);
    });
  });

  describe("isIsoDateString", () => {
    it.each([
      "2026-02-25",
      "2024-02-29", // leap day
      new Date().toISOString().slice(0, 10),
    ])("should accept the value %s", (value) => {
      expect(isIsoDateString(value)).toBe(true);
    });

    it.each([
      null,
      undefined,
      "",
      "02/25/2026",
      "2026-02-25T18:44:16.906Z",
      new Date().toISOString(),
      "2026-02-29", // NOT a leap day
    ])("should reject the value %s", (value) => {
      expect(isIsoDateString(value)).toBe(false);
    });
  });

  describe("isIsoDateTimeString", () => {
    it.each([
      "2026-02-25T18:44:16.906Z",
      "2024-02-29T18:44:16.906Z", // leap day
      new Date().toISOString(),
    ])("should accept the value %s", (value) => {
      expect(isIsoDateTimeString(value)).toBe(true);
    });

    it.each([
      null,
      undefined,
      "",
      "2026-02-25",
      "02/25/2026",
      "20260225T174310Z",
      "2026-02-29T18:44:16.906Z", // NOT a leap day
    ])("should reject the value %s", (value) => {
      expect(isIsoDateTimeString(value)).toBe(false);
    });
  });
});
