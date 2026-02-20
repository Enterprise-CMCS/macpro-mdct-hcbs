import { isValidBanner } from "../bannerValidation";
import { logger } from "../../libs/debug-lib";
import { BannerAreas, BannerFormData } from "../../types/banner";

jest.mock("../../libs/debug-lib", () => ({
  logger: {
    warn: jest.fn(),
  },
}));
const warn = logger.warn as jest.Mock;

const validPayload: BannerFormData = {
  title: "mock title",
  area: BannerAreas.QMS,
  description: "mock description",
  link: "https://example.com",
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
};

describe("isValidBanner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should accept a valid payload", () => {
    expect(isValidBanner(validPayload)).toBe(true);
  });

  it.each([
    { name: "null", value: null },
    { name: "undefined", value: undefined },
    { name: "empty string", value: "" },
    { name: "a non-empty string", value: "oof" },
    { name: "a number", value: 42 },
  ])("should reject $name", ({ value }) => {
    expect(isValidBanner(value)).toBe(false);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("banner must be an object")
    );
  });

  it.each(["title", "area", "description", "startDate", "endDate"])(
    "should reject a payload with no %s",
    (key) => {
      const payload = structuredClone(validPayload);
      delete payload[key as keyof BannerFormData];
      expect(isValidBanner(payload)).toBe(false);
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("banner." + key)
      );
    }
  );

  it("should accept a valid payload with no link", () => {
    const payload = structuredClone(validPayload);
    delete payload.link;
    expect(isValidBanner(payload)).toBe(true);
  });

  it.each(["key", "createdAt", "lastAltered", "lastAlteredBy"])(
    "should accept the optional field %s",
    (key) => {
      const payload = structuredClone(validPayload);
      (payload as any)[key] = "some value";
      expect(isValidBanner(payload)).toBe(true);
    }
  );

  it("should reject a payload with an unrecognized field", () => {
    expect(isValidBanner({ ...validPayload, foo: "bar" })).toBe(false);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("unwanted field")
    );
  });

  it("should reject a a banner with non-string title", () => {
    expect(isValidBanner({ ...validPayload, title: 42 })).toBe(false);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("banner.title must be a string")
    );
  });

  it("should reject a a banner with invalid area", () => {
    expect(isValidBanner({ ...validPayload, area: "nowhere" })).toBe(false);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("banner.area must be one of")
    );
  });

  it("should reject a a banner with non-string description", () => {
    expect(isValidBanner({ ...validPayload, description: false })).toBe(false);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("banner.description must be a string")
    );
  });

  it("should reject a a banner with non-URL link", () => {
    expect(isValidBanner({ ...validPayload, link: "not a url" })).toBe(false);
    expect(warn).toHaveBeenCalledWith(
      expect.stringMatching(/banner\.link.* must be a valid URL/)
    );
  });

  it("should reject a a banner with invalid startDate", () => {
    const payload = { ...validPayload, startDate: "02/18/2026" };
    expect(isValidBanner(payload)).toBe(false);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("banner.startDate must be an ISO date string")
    );
  });

  it("should reject a a banner with invalid endDate", () => {
    const payload = { ...validPayload, endDate: "2026-02-29T19:33:30.893Z" };
    expect(isValidBanner(payload)).toBe(false);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("banner.endDate must be an ISO date string")
    );
  });

  it("should reject a a banner that ends before it starts", () => {
    const payload = {
      ...validPayload,
      startDate: "2026-02-19T19:33:30.893Z",
      endDate: "2026-02-17T19:33:30.893Z",
    };
    expect(isValidBanner(payload)).toBe(false);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("banner.endDate must be after banner.startDate")
    );
  });
});
