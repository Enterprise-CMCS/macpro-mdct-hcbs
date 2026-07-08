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
  navTitle: "mock-textbox-title",
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
  navTitle: "mock-textarea-title",
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
  navTitle: "mock-number-title",
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
  navTitle: "mock-date-title",
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
  navTitle: "mock-radio-title",
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

export const checkboxFieldSection: FormPageTemplate = {
  id: "mock-checkbox-id",
  navTitle: "mock-checkbox-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.Checkbox,
      id: "id-checkbox",
      label: "CheckboxField",
      choices: [
        {
          value: "checkbox option 1",
          label: "checkbox option 1",
          checked: true,
        },
        {
          value: "checkbox option 2",
          label: "checkbox option 2",
          checked: true,
        },
        {
          value: "checkbox option 3",
          label: "checkbox option 3",
          checked: false,
        },
      ],
      answer: ["checkbox option 1", "checkbox option 2"],
      required: true,
    },
  ],
};

export const multiCategoryNdrSection: FormPageTemplate = {
  id: "mock-multiCategoryNdr-id",
  navTitle: "mock-multiCategoryNdr-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.MultiCategoryNdr,
      id: "measure-rates",
      assessments: [
        { id: "assessment-1", label: "First Assessment" },
        { id: "assessment-2", label: "Second Assessment" },
      ],
      categories: [
        { id: "category-1", label: "First Category" },
        { id: "category-2", label: "Second Category" },
      ],
      required: true,
      multiplier: 1000,
    },
  ],
};

export const multiRateNdrSection: FormPageTemplate = {
  id: "mock-multiRateNdr-id",
  navTitle: "mock-multiRateNdr-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.MultiRateNdr,
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
  navTitle: "mock-ndr-title",
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

export const performanceNdrSection: FormPageTemplate = {
  id: "mock-performanceNdr-id",
  navTitle: "mock-performanceNdr-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.PerformanceNdr,
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

export const EligibilityTableSection: FormPageTemplate = {
  id: "mock-eligibilityTable-id",
  navTitle: "mock-eligibilityTable-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.EligibilityTable,
      id: "add-other-eligibility-table",
      caption: "Other Eligibility",
      fieldLabels: {
        title: "title",
        description: "description",
        recheck: "recheck",
        frequency: "frequency",
        eligibilityUpdate: "eligibilityUpdate",
      },
      modalInstructions: "modalInstructions",
      frequencyOptions: [{ label: "Annually", value: "Annually" }],
      answer: [
        {
          title: "string",
          description: "string",
          recheck: "Yes",
          frequency: "Annually",
          eligibilityUpdate: "No",
        },
      ],
    },
  ],
};

export const lengthOfStayRateSection: FormPageTemplate = {
  id: "mock-lengthOfStayRate-id",
  navTitle: "mock-lengthOfStayRate-title",
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

export const readmissionRateSection: FormPageTemplate = {
  id: "mock-readmissionRate-id",
  navTitle: "mock-readmissionRate-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.ReadmissionRate,
      id: "measure-rates",
      labels: {
        stayCount: "Count of Index Hospital Stays",
        obsReadmissionCount: "Count of Observed 30-Day Readmissions",
        obsReadmissionRate: "Observed Readmission Rate",
        expReadmissionCount: "Count of Expected 30-Day readmissions",
        expReadmissionRate: "Expected Readmission Rate",
        obsExpRatio: "Observed-to-Expected Ratio",
        beneficiaryCount: "Count of Beneficiaries in Medicaid Population",
        outlierCount: "Number of Outliers",
        outlierRate: "Outlier Rate",
      },
      hintText: {
        stayCountHint: "stayCountHint",
        obsReadmissionCountHint: "obsReadmissionCountHint",
        obsReadmissionRateHint: "obsReadmissionRateHint",
        expReadmissionCountHint: "expReadmissionCountHint",
        expReadmissionRateHint: "expReadmissionRateHint",
        obsExpRatioHint: "obsExpRatioHint",
        beneficiaryCountHint: "beneficiaryCountHint",
        outlierCountHint: "outlierCountHint",
        outlierRateHint: "outlierRateHint",
      },
      required: true,
    },
  ],
};

export const measureDetailsSection: MeasurePageTemplate = {
  id: "mock-lengthOfStayRate-id",
  navTitle: "mock-lengthOfStayRate-title",
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

export const listInputSection: FormPageTemplate = {
  id: "mock-list-input-id",
  navTitle: "mock-list-input-title",
  type: PageType.Standard,
  elements: [
    {
      type: ElementType.ListInput,
      id: "ListInput",
      label: "ListInput",
      fieldLabel: "List Input Field",
      helperText: "Information to help user fill out list input",
      buttonText: "Add another",
      answer: ["sample text", "sample text 2"],
      required: true,
    },
  ],
};
