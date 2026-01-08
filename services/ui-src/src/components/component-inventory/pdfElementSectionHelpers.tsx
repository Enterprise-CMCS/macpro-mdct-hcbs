import {
  CMIT,
  DataSource,
  ElementType,
  FormPageTemplate,
  MeasurePageTemplate,
  PageType,
} from "types";

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
      required: true,
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
      required: true,
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
      required: true,
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
      required: true,
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
      required: true,
    },
  ],
};

export const ndrFieldsSection: FormPageTemplate = {
  id: "mock-ndrFields-id",
  title: "mock-ndrFields-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.NdrFields,
      id: "measure-rates",
      assessments: [
        { id: "assessment-1", label: "First Assessment" },
        { id: "assessment-2", label: "Second Assessment" },
      ],
      fields: [
        { id: "field-1", label: "First Field" },
        { id: "field-2", label: "Second Field" },
      ],
      required: true,
      multiplier: 1000,
    },
  ],
};

export const ndrEnhancedSection: FormPageTemplate = {
  id: "mock-ndrEnhanced-id",
  title: "mock-ndrEnhanced-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.NdrEnhanced,
      id: "measure-rates",
      assessments: [
        { id: "assessment-1", label: "First Assessment" },
        { id: "assessment-2", label: "Second Assessment" },
      ],
      required: true,
      helperText: "Helper text",
    },
  ],
};

export const ndrSection: FormPageTemplate = {
  id: "mock-ndr-id",
  title: "mock-ndr-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.Ndr,
      id: "measure-rates",
      label: "Label",
      required: true,
    },
  ],
};

export const ndrBasicSection: FormPageTemplate = {
  id: "mock-ndrBasic-id",
  title: "mock-ndrBasic-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.NdrBasic,
      id: "measure-rates",
      label: "Label",
      required: true,
      hintText: {
        numHint: "numHint",
        denomHint: "denomHint",
        rateHint: "rateHint",
      },
      multiplier: 100,
      displayRateAsPercent: true,
    },
  ],
};

export const lengthOfStayRateSection: FormPageTemplate = {
  id: "mock-lengthOfStayRate-id",
  title: "mock-lengthOfStayRate-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.LengthOfStayRate,
      id: "measure-rates",
      labels: {
        actualCount: "actualCount",
        denominator: "denominator",
        expectedCount: "expectedCount",
        populationRate: "populationRate",
        actualRate: "actualRate",
        expectedRate: "expectedRate",
        adjustedRate: "adjustedRate",
      },
      required: true,
    },
  ],
};

export const measureDetailsSection: MeasurePageTemplate = {
  id: "mock-lengthOfStayRate-id",
  title: "mock-lengthOfStayRate-title",
  type: PageType.Measure,
  cmitId: "mockCmitID",
  cmitInfo: {
    name: "name",
    cmit: 123,
    measureSteward: "CMS",
    dataSource: DataSource.Hybrid,
  } as CMIT,
  elements: [
    {
      type: ElementType.MeasureDetails,
      id: "",
    },
  ],
};
