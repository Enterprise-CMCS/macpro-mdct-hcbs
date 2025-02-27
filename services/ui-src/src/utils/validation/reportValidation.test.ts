import { elementsValidateSchema } from "./reportValidation";

const yupValidateTestHelper = async (payload: any) => {
  if (!payload) {
    throw new Error("missing data");
  }

  const validatedPayload = await elementsValidateSchema.validate(payload, {
    stripUnknown: true,
  });

  return validatedPayload;
};
describe("Textbox validation", () => {
  it("successfully validates valid types of textboxes", async () => {
    const textboxFormData = {
      elements: [
        {
          answer: "hello",
          type: "textbox",
          label: "name",
        },
        {
          answer: "ac@test.com", // email
          type: "textbox",
          label: "email address",
        },
      ],
    };
    const validatedTextboxData = await yupValidateTestHelper(textboxFormData);
    expect(validatedTextboxData).toEqual(textboxFormData);
  });
  it("throws an error when validating an invalid textbox", () => {
    const invalidTextboxFormData = {
      elements: [
        {
          answer: "",
          type: "textbox",
          label: "name",
        },
      ],
    };
    expect(async () => {
      await yupValidateTestHelper(invalidTextboxFormData);
    }).rejects.toThrow("A response is required");
  });
  it("throws an error when email is invalid", () => {
    const invalidTextboxFormData = {
      elements: [
        {
          answer: "aco@",
          type: "textbox",
          label: "email address",
        },
      ],
    };
    expect(async () => {
      await yupValidateTestHelper(invalidTextboxFormData);
    }).rejects.toThrow("Response must be a valid email address");
  });
});

describe("Radio validation", () => {
  it("successfully validates valid types of radios", async () => {
    const radioFormData = {
      elements: [
        {
          answer: "yes",
          type: "radio",
          label: "radio childless",
        },
        {
          answer: "no",
          type: "radio",
          label: "radio with children",
          value: [
            {
              checkedChildren: [{ answer: "i'm a child" }],
            },
          ],
        },
      ],
    };
    const validatedRadioData = await yupValidateTestHelper(radioFormData);
    expect(validatedRadioData).toEqual(radioFormData);
  });
  it("throws an error when validating an invalid radio", () => {
    const emptyRadioFormData = {
      elements: [
        {
          answer: "",
          type: "radio",
          label: "radio childless",
        },
      ],
    };
    expect(async () => {
      await yupValidateTestHelper(emptyRadioFormData);
    }).rejects.toThrow("A response is required");
  });

  it("throws an error when validating an invalid radio with children", () => {
    const emptyRadioFormData = {
      elements: [
        {
          answer: "no",
          type: "radio",
          label: "radio with children",
          value: [
            {
              checkedChildren: [{ answer: "" }],
            },
          ],
        },
      ],
    };
    expect(async () => {
      await yupValidateTestHelper(emptyRadioFormData);
    }).rejects.toThrow("A response is required");
  });
});
