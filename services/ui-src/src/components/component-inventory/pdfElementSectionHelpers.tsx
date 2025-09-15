import { ElementType, FormPageTemplate, PageType } from "types";

export const textboxSection: FormPageTemplate = {
  id: "mock-textbox-id",
  title: "mock-textbox-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.Textbox,
      id: "Textbox",
      label: "Textbox",
      helperText: "Information to help user fill out textbox",
      answer: "sample text",
    },
  ],
};

export const textAreaSection: FormPageTemplate = {
  id: "mock-textarea-id",
  title: "mock-textarea-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.TextAreaField,
      id: "textarea",
      label: "TextArea",
      helperText: "Information to help user fill out textbox",
      answer: "sample text",
    },
  ],
};

export const numberFieldSection: FormPageTemplate = {
  id: "mock-numberfield-id",
  title: "mock-number-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.Textbox,
      id: "numberField",
      label: "NumberField",
      helperText: "Information to help user fill out number field",
      answer: "5",
    },
  ],
};

export const dateFieldSection: FormPageTemplate = {
  id: "mock-date-id",
  title: "mock-date-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.Date,
      id: "date",
      label: "Reporting period start date",
      helperText:
        "What is the reporting period Start Date applicable to the measure results?",
    },
  ],
};

export const radioFieldSection: FormPageTemplate = {
  id: "mock-radio-id",
  title: "mock-radio-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.Radio,
      id: "id-radio",
      label: "RadioField",
      choices: [
        { value: "radio option 1", label: "radio option 1" },
        { value: "radio option 2", label: "radio option 2" },
        { value: "radio option 3", label: "radio option 3" },
      ],
      answer: "radio option 1",
    },
  ],
};

export const dropdownFieldSection: FormPageTemplate = {
  id: "mock-dropdown-id",
  title: "mock-dropdown-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.Dropdown,
      id: "id-dropdown",
      label: "DropdownField",
      options: [
        { value: "dropdown option 1", label: "dropdown option 1" },
        { value: "dropdown option 2", label: "dropdown option 2" },
        { value: "dropdown option 3", label: "dropdown option 3" },
      ],
      answer: "dropdown option 2",
    },
  ],
};
