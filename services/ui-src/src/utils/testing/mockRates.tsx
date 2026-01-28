import {
  NdrTemplate,
  ElementType,
  NdrEnhancedTemplate,
  NdrFieldsTemplate,
  NdrBasicTemplate,
  LengthOfStayRateTemplate,
  ReadmissionRateTemplate,
} from "types";

export const mockNDR: NdrTemplate = {
  id: "mock-ndr",
  type: ElementType.Ndr,
  label: "Person uses the same environments as people without disabilities",
  answer: {
    rate: 1.66666666666667,
    numerator: 5,
    denominator: 3,
  },
  required: true,
};

export const mockedNDREnhanced: NdrEnhancedTemplate = {
  id: "mock-ndr-enhanced",
  type: ElementType.NdrEnhanced,
  label: "test label",
  helperText: "helper text",
  required: true,
  assessments: [{ id: "test-1", label: "assessment 1" }],
  answer: {
    denominator: 2,
    rates: [
      {
        id: "test-1",
        numerator: undefined,
        rate: undefined,
      },
    ],
  },
};

export const mockNDRFields: NdrFieldsTemplate = {
  id: "mock-ndr-fields",
  type: ElementType.NdrFields,
  required: true,
  assessments: [
    {
      label: "Assessment 1",
      id: "mock-assess-1",
    },
  ],
  fields: [
    {
      label: "Field 1",
      id: "mock-field-1",
    },
  ],
  answer: [
    {
      denominator: 2,
      rates: [
        {
          id: "mock-assess-1.mock-field-1",
          numerator: undefined,
          rate: undefined,
        },
      ],
    },
  ],
};

export const mockNDRBasics: NdrBasicTemplate = {
  id: "mock-ndr-basic",
  type: ElementType.NdrBasic,
  required: true,
};

export const mockLengthOfStayFields: LengthOfStayRateTemplate = {
  id: "",
  type: ElementType.LengthOfStayRate,
  labels: {
    actualCount: "Actual Count",
    denominator: "Denominator",
    expectedCount: "Expected Count",
    populationRate: "Population Rate",
    actualRate: "Actual Rate",
    expectedRate: "Expected Rate",
    adjustedRate: "Adjusted Rate",
  },
  answer: undefined,
  required: true,
};

export const mockReadmissionRateFields: ReadmissionRateTemplate = {
  id: "",
  type: ElementType.ReadmissionRate,
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
  answer: undefined,
  required: true,
};
