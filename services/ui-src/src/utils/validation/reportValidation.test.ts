import { ElementType } from "types";
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
          type: ElementType.Textbox,
          label: "name",
          id: "textbox1",
        },
        {
          answer: "ac@test.com", // email
          type: ElementType.Textbox,
          label: "email address",
          id: "email-textbox",
        },
        {
          answer: "wee",
          type: ElementType.TextAreaField,
          label: "this is a text area field",
          id: "textarea1",
        },
        {
          answer: "09/12/23",
          type: ElementType.Date,
          label: "this is a date",
          id: "date1",
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
          type: ElementType.Textbox,
          label: "name",
          id: "textbox1",
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
          type: ElementType.Textbox,
          label: "email address",
          id: "textbox1",
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
          type: ElementType.Radio,
          label: "radio childless",
          id: "radio1",
        },
        {
          answer: "no",
          type: ElementType.ReportingRadio,
          label: "reporting radio extrordinare",
          id: "reporting-radio",
        },
        {
          answer: "no",
          type: ElementType.Radio,
          label: "radio with children",
          value: [
            {
              checkedChildren: [{ answer: "i'm a child" }],
            },
          ],
          id: "radio2",
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
          type: ElementType.Radio,
          label: "radio childless",
          id: "radio1",
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
          type: ElementType.Radio,
          label: "radio with children",
          value: [
            {
              checkedChildren: [{ answer: "" }],
            },
          ],
          id: "radio1",
        },
      ],
    };
    expect(async () => {
      await yupValidateTestHelper(emptyRadioFormData);
    }).rejects.toThrow("A response is required");
  });
});

describe("Ignores validation for elements that are not editable", () => {
  it("successfully validates non editable types", async () => {
    const nonEditableElements = {
      elements: [
        {
          type: ElementType.ButtonLink,
          id: "return-button",
          label: "Return to Required Measures Dashboard",
          to: "req-measure-result",
        },
        {
          type: ElementType.Header,
          id: "measure-header",
          text: "{measureName}",
        },
        {
          type: ElementType.MeasureDetails,
          id: "measure-details-section",
        },
        {
          type: ElementType.Accordion,
          id: "measure-instructions",
          label: "Instructions",
          value:
            "[Optional instructional content that could support the user in completing this page]",
        },
        {
          type: ElementType.SubHeader,
          id: "measure-information-subheader",
          text: "Measure Information",
        },
        {
          type: ElementType.MeasureFooter,
          id: "measure-footer",
          prevTo: "req-measure-result",
          completeMeasure: true,
          clear: true,
        },
        {
          type: ElementType.MeasureResultsNavigationTable,
          measureDisplay: "quality",
          id: "measure-results-navigation-table",
        },
        {
          type: ElementType.SubmissionParagraph,
          id: "submitted",
        },
      ],
    };
    const validatedData = await yupValidateTestHelper(nonEditableElements);
    expect(validatedData).toEqual(nonEditableElements);
  });
});
