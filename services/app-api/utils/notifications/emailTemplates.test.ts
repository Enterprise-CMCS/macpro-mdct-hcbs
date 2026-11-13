import { afterEach, describe, expect, it, vi } from "vitest";
import { formatDate } from "./emailTemplates";

afterEach(() => vi.useRealTimers());

describe("formatDate", () => {
  it("should match the requested Eastern Time format", () => {
    expect(formatDate(1793032366480)).toBe("10/26/2026, 12:32pm ET");
  });

  it("should use Eastern standard time in winter", () => {
    expect(formatDate(Date.UTC(2026, 0, 15, 17, 5))).toBe(
      "1/15/2026, 12:05pm ET"
    );
  });

  it("should use Eastern daylight time in summer", () => {
    expect(formatDate(Date.UTC(2026, 6, 15, 16, 5))).toBe(
      "7/15/2026, 12:05pm ET"
    );
  });

  it("should default to the current time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T05:00:00Z"));
    expect(formatDate(undefined)).toBe("1/15/2026, 12:00am ET");
  });
});
