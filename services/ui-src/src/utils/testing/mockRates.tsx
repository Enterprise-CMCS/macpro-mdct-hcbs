import {
  NdrTemplate,
  ElementType,
  NdrEnhancedTemplate,
  NdrFieldsTemplate,
  NdrBasicTemplate,
  LengthOfStayRateTemplate,
} from "types";

export const mockNDR: NdrTemplate = {
  id: "mock-ndr",
  type: ElementType.Ndr,
  label: "Person uses the same environments as people without disabilities",
  answer: {
    performanceTarget: 4,
    rate: 1.66666666666667,
    numerator: 5,
    denominator: 3,
  },
  performanceTargetLabel: "What is the 2028 state performance target?",
  required: true,
};

export const mockedNDREnhanced: NdrEnhancedTemplate = {
  id: "mock-ndr-enhanced",
  type: ElementType.NdrEnhanced,
  label: "test label",
  helperText: "helper text",
  required: true,
  performanceTargetLabel: "What is the 2028 state performance target?",
  assessments: [{ id: "test-1", label: "assessment 1" }],
  answer: {
    denominator: 2,
    rates: [
      {
        id: "test-1",
        numerator: undefined,
        rate: undefined,
        performanceTarget: undefined,
      },
    ],
  },
};

export const mockNDRFields: NdrFieldsTemplate = {
  id: "mock-ndr-fields",
  type: ElementType.NdrFields,
  required: true,
  labelTemplate:
    "What is the 2028 state performance target for this {{assessment}} {{field}}?",
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
          performanceTarget: undefined,
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
    performanceTarget: "Performance Target",
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
