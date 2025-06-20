import { validateBannerPayload } from "../bannerValidation";
import { error } from "../constants";

const validObject = {
  key: "1023",
  title: "this is a title",
  description: "this is a description",
  link: "https://www.google.com",
  startDate: 11022933, // Jan 1, 1970
  endDate: 103444405, // Jan 2, 1970
  isActive: false,
};

const invalidObject = {
  // missing key
  title: "this is a title",
  description: "this is a description",
  link: "https://www.google.com",
  startDate: 11022933, // Jan 1, 1970
  endDate: 103444405, // Jan 2, 1970
};

describe("Test validateBannerPayload function", () => {
  it("successfully validates a valid object", async () => {
    const validatedData = await validateBannerPayload(validObject);
    expect(validatedData).toEqual(validObject);
  });
  it("throws an error when validating an invalid object", () => {
    expect(async () => {
      await validateBannerPayload(invalidObject);
    }).rejects.toThrow();
  });
});

describe("Test validateBannerPayload function", () => {
  it("successfully validates a valid object", async () => {
    const validatedData = await validateBannerPayload(validObject);
    expect(validatedData).toEqual(validObject);
  });
  it("throws an error when validating an invalid object", () => {
    expect(async () => {
      await validateBannerPayload(invalidObject);
    }).rejects.toThrow();
  });
});

describe("validateBannerPayload for startDate (API)", () => {
  const basePayload = {
    key: "admin-banner-id",
    title: "mock title",
    description: "mock description",
  };

  it("should throw an error if the payload is undefined", async () => {
    await expect(validateBannerPayload(undefined)).rejects.toThrow(
      "Missing required data."
    );
  });

  it("should pass when startDate is before endDate", async () => {
    const payload = {
      ...basePayload,
      startDate: 11022933, // Jan 1, 1970
      endDate: 103444405, // Jan 2, 1970
    };
    await expect(validateBannerPayload(payload)).resolves.toEqual(payload);
  });

  it("should throw an error when endDate is before startDate", async () => {
    const payload = {
      ...basePayload,
      startDate: 103444405, // Jan 2, 1970
      endDate: 11022933, // Jan 1, 1970
    };
    await expect(validateBannerPayload(payload)).rejects.toThrow(
      error.END_DATE_BEFORE_START_DATE
    );
  });

  it("should pass when endDate is equal to startDate", async () => {
    const payload = {
      ...basePayload,
      startDate: 11022933, // Jan 1, 1970
      endDate: 11022933, // Jan 1, 1970
    };
    await expect(validateBannerPayload(payload)).resolves.toEqual(payload);
  });
});
