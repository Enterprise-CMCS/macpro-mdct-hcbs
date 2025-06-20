import {
  bannerFormValidateSchema,
  validateBannerPayload,
} from "./bannerValidation";
import { error } from "../../constants";

const validObject = {
  key: "1023",
  title: "this is a title",
  description: "this is a description",
  link: "https://www.google.com",
  startDate: 11022933,
  endDate: 103444405,
  isActive: false,
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

  it("rejects payloads with start date after end date", () => {
    expect(async () => {
      await validateBannerPayload({
        ...validObject,
        startDate: validObject.endDate + 1,
      });
    }).rejects.toThrow();
  });
});

describe("bannerFormValidateSchema (UI Form", () => {
  const createFormValues = (startDate?: string, endDate?: string) => ({
    bannerTitle: { answer: "mock title" },
    bannerDescription: { answer: "mock description" },
    bannerLink: { answer: "http://example.com" },
    bannerStartDate: { answer: startDate ?? "" },
    bannerEndDate: { answer: endDate ?? "" },
  });

  it("should throw an error if the payload is undefined", async () => {
    await expect(validateBannerPayload(undefined)).rejects.toThrow(
      "missing data"
    );
  });

  it("should pass when startDate is before endDate", async () => {
    const formValues = createFormValues("01/01/1970", "01/02/1970");
    await expect(
      bannerFormValidateSchema.validate(formValues)
    ).resolves.toEqual(formValues);
  });

  it("should pass when startDate is the same as endDate", async () => {
    const formValues = createFormValues("01/01/1970", "01/01/1970");
    await expect(
      bannerFormValidateSchema.validate(formValues)
    ).resolves.toEqual(formValues);
  });

  it("should throw an error when startDate is after endDate", async () => {
    const formValues = createFormValues("01/02/1970", "01/01/1970");
    await expect(bannerFormValidateSchema.validate(formValues)).rejects.toThrow(
      error.END_DATE_BEFORE_START_DATE
    );
  });
});
