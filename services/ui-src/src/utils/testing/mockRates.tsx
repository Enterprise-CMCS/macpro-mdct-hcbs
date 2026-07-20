import {
  NdrTemplate,
  ElementType,
  MultiRateNdrTemplate,
  MultiCategoryNdrTemplate,
  PerformanceNdrTemplate,
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

export const mockedMultiRateNdr: MultiRateNdrTemplate = {
  id: "mock-multi-rate-ndr",
  type: ElementType.MultiRateNdr,
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

export const mockMultiCategoryNdr: MultiCategoryNdrTemplate = {
  id: "mock-multi-category-ndr",
  type: ElementType.MultiCategoryNdr,
  required: true,
  assessments: [
    {
      label: "Assessment 1",
      id: "mock-assess-1",
    },
  ],
  categories: [
    {
      label: "Category 1",
      id: "mock-category-1",
    },
  ],
  answer: [
    {
      denominator: 2,
      rates: [
        {
          id: "mock-assess-1.mock-category-1",
          numerator: undefined,
          rate: undefined,
        },
      ],
    },
  ],
};

export const mockPerformanceNdr: PerformanceNdrTemplate = {
  id: "mock-performance-ndr",
  type: ElementType.PerformanceNdr,
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
  hintText: {
    stayCount: "stayCount",
    obsReadmissionCount: "obsReadmissionCount",
    obsReadmissionRate: "obsReadmissionRate",
    expReadmissionCount: "expReadmissionCount",
    expReadmissionRate: "expReadmissionRate",
    obsExpRatio: "obsExpRatio",
    beneficiaryCount: "beneficiaryCount",
    outlierCount: "outlierCount",
    outlierRate: "outlierRate",
  },
  answer: undefined,
  required: true,
};
