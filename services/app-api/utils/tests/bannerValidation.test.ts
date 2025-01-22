import { validateBannerPayload } from "../bannerValidation";

const validObject = {
  key: "1023",
  title: "this is a title",
  description: "this is a description",
  link: "https://www.google.com",
  startDate: 11022933,
  endDate: 103444405,
};

const invalidObject = {
  // missing key
  title: "this is a title",
  description: "this is a description",
  link: "https://www.google.com",
  startDate: 11022933,
  endDate: 103444405,
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
