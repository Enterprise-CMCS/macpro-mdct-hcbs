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
  performanceTargetLabel:
    "What is the 2028 state performance target for this assessment?",
  required: true,
};

export const mockedNDREnhanced: NdrEnhancedTemplate = {
  id: "mock-ndr-enhanced",
  type: ElementType.NdrEnhanced,
  label: "test label",
  helperText: "helper text",
  performanceTargetLabel:
    "What is the 2028 state performance target for this assessment?",
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
      denominator: undefined,
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
};

export const mockLengthOfStayFields: LengthOfStayRateTemplate = {
  id: "",
  type: ElementType.LengthOfStayRate,
  labels: {
    actualCount: "1",
    performanceTarget: "2",
    denominator: "3",
    expectedCount: "4",
    populationRate: "5",
    actualRate: "6",
    expectedRate: "7",
    adjustedRate: "8",
  },
  answer: undefined,
};
