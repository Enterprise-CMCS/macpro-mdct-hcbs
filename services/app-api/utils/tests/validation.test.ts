import { error } from "../constants";
import { validateData } from "../validation";

import { number, object, string } from "yup";

const validationSchema = object().shape({
  key: string().required(),
  title: string().required(),
  description: string().required(),
  link: string().url().notRequired(),
  startDate: number().notRequired(),
  endDate: number().notRequired(),
});

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

describe("Test validateData function", () => {
  it("successfully validates a valid object", async () => {
    const validatedData = await validateData(validationSchema, validObject);
    expect(validatedData).toEqual(validObject);
  });
  it("throws an error when validating an invalid object", () => {
    expect(async () => {
      await validateData(validationSchema, invalidObject);
    }).rejects.toThrow(error.INVALID_DATA);
  });
});
