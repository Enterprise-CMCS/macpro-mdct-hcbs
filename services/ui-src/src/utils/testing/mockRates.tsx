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
    denominatorCol1: "Denominator Column 1",
    numeratorCol2: "Numerator Column 2",
    expectedRateCol3: "Expected Rate Column 3",
    numeratorDenominatorCol4: "Numerator Denominator Column 4",
    expectedRateCol5: "Expected Rate Column 5",
    expectedRateCol6: "Expected Rate Column 6",
    denominatorCol7: "Denominator Column 7",
    numeratorCol8: "Numerator Column 8",
    expectedRateCol9: "Expected Rate Column 9",
  },
  answer: undefined,
  required: true,
};
