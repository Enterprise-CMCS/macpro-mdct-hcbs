import {
  ElementType,
  LengthOfStayRateTemplate,
  ReadmissionRateTemplate,
  ListInputTemplate,
  MeasurePageTemplate,
  NdrBasicTemplate,
  NdrEnhancedTemplate,
  NdrFieldsTemplate,
  NdrTemplate,
  PageElement,
  PageStatus,
  PageType,
  RadioTemplate,
  Report,
  TextboxTemplate,
} from "types";
import {
  elementSatisfiesRequired,
  inferredReportStatus,
  pageInProgress,
  pageIsCompletable,
} from "./completeness";

describe("inferredReportStatus", () => {
  test("handles different rollup types", () => {
    const report = {
      pages: [
        {
          id: "my-id",
          cmitId: "MyCmit",
          title: "a title",
          status: PageStatus.COMPLETE,
          required: true,
          type: PageType.Measure,
          elements: [
            {
              id: "good-question",
              type: ElementType.Textbox,
              answer: "Good",
              required: true,
            },
          ],
        },
        {
          id: "optional-id",
          cmitId: "OtherCmit",
          status: PageStatus.IN_PROGRESS,
          required: false,
          type: PageType.Measure,
          elements: [
            {
              id: "good-question",
              type: ElementType.Textbox,
              answer: "Good",
              required: true,
            },
          ],
        },
        {
          id: "req-measure-result",
          required: true,
          elements: [],
        },
        {
          id: "optional-measure-result",
          required: true,
          elements: [],
        },
        {
          id: "general-id",
          required: true,
          title: "a title",
          elements: [
            {
              id: "good-question",
              type: ElementType.Textbox,
              answer: "Good",
              required: true,
            },
          ],
        },
        {
          id: "other-id",
          required: true,
          title: "a title",
          elements: [
            {
              id: "no-question",
              type: ElementType.Textbox,
              answer: undefined,
              required: true,
            },
          ],
        },
      ],
    } as Report;
    expect(inferredReportStatus(report, "my-id")).toEqual(PageStatus.COMPLETE);
    expect(inferredReportStatus(report, "req-measure-result")).toEqual(
      PageStatus.COMPLETE
    );
    expect(inferredReportStatus(report, "optional-measure-result")).toEqual(
      PageStatus.IN_PROGRESS
    );
    expect(inferredReportStatus(report, "general-id")).toEqual(
      PageStatus.COMPLETE
    );
    expect(inferredReportStatus(report, "other-id")).toEqual(
      PageStatus.NOT_STARTED
    );
  });
});

describe("pageInProgress", () => {
  const isInProgress = (element: object) => {
    const report = {
      pages: [
        {
          id: "mock-page-id",
          elements: [element as PageElement],
        },
      ],
    } as Report;
    return pageInProgress(report, "mock-page-id");
  };

  it("should treat missing or empty answers as not in progress", () => {
    expect(isInProgress({})).toBe(false);
    expect(isInProgress({ answer: undefined })).toBe(false);
    expect(isInProgress({ answer: "" })).toBe(false);
  });

  it("should treat numeric answers as in progress", () => {
    expect(isInProgress({ answer: 0 })).toBe(true);
    expect(isInProgress({ answer: 42 })).toBe(true);
  });

  it("should treat empty answer objects as not in progress", () => {
    expect(isInProgress({ answer: {} })).toBe(false);
    expect(isInProgress({ answer: [] })).toBe(false);
    expect(isInProgress({ answer: [{}, {}] })).toBe(false);
    expect(isInProgress({ answer: { x: [{}] } })).toBe(false);
  });

  it("should treat answers with data in progress", () => {
    expect(isInProgress({ answer: "hello" })).toBe(true);
    expect(isInProgress({ answer: [1, 2] })).toBe(true);
    expect(isInProgress({ answer: [{ x: 42 }] })).toBe(true);
    expect(isInProgress({ answer: { x: [96, 78] } })).toBe(true);
  });

  it("should treat unknown data types as in progress", () => {
    // We don't, and should never, have a BigInt answer type. But if we did:
    expect(isInProgress({ answer: 99n })).toBe(true);
  });
});

describe("pageIsCompletable", () => {
  test("handles empty conditions", () => {
    const missingPageReport = {
      pages: [] as MeasurePageTemplate[],
    } as Report;
    expect(pageIsCompletable(missingPageReport, "my-id")).toBeFalsy();

    const noElementsOnPage = {
      pages: [{ id: "my-id" }],
    } as Report;
    expect(pageIsCompletable(noElementsOnPage, "my-id")).toBeTruthy();
  });

  test("false when incomplete element", () => {
    const report = {
      pages: [
        {
          id: "my-id",
          status: PageStatus.IN_PROGRESS,
          elements: [
            {
              id: "bad-question",
              type: ElementType.Radio,
              answer: undefined,
              required: true,
            },
          ],
        },
      ],
    } as Report;
    expect(pageIsCompletable(report, "my-id")).toBeFalsy();
  });

  test("false when dependent page is incomplete", () => {
    const report = {
      pages: [
        {
          id: "my-id",
          title: "my title",
          status: PageStatus.IN_PROGRESS,
          cmitId: "MyCmit",
          elements: [
            {
              id: "delivery-method-radio",
              type: ElementType.Radio,
              answer: "FFS",
              required: true,
              choices: [{ value: "FFS" }],
            },
          ],
          dependentPages: [
            {
              key: "FFS",
              template: "FFS-1",
            },
          ],
        },
        {
          id: "FFS-1",
          title: "child title",
          status: PageStatus.IN_PROGRESS,
          elements: [
            {
              id: "a-text",
              type: ElementType.TextAreaField,
              answer: undefined,
              required: true,
            },
          ],
        },
      ],
    } as Report;
    expect(pageIsCompletable(report, "my-id")).toBeFalsy();
  });

  test("succeeds when complete element", () => {
    const report = {
      pages: [
        {
          id: "my-id",
          status: PageStatus.IN_PROGRESS,
          elements: [
            {
              id: "good-question",
              type: ElementType.Textbox,
              answer: "WOW",
              required: true,
            },
          ],
        },
      ],
    } as Report;
    expect(pageIsCompletable(report, "my-id")).toBeTruthy();
  });
});

describe("elementSatisfiesRequired", () => {
  test("returns true when hidden or not required", () => {
    const hiddenElement: TextboxTemplate = {
      id: "other-element",
      label: "hidden textbox",
      answer: "foo",
      type: ElementType.Textbox,
      required: true,
    };
    const notRequired: TextboxTemplate = {
      id: "not-element",
      label: "optional textbox",
      answer: "foo",
      type: ElementType.Textbox,
      required: false,
    };
    const otherElement: TextboxTemplate = {
      id: "other-element",
      label: "irrelevant other textbox",
      answer: "foo",
      type: ElementType.Textbox,
      required: false,
    };
    const elements = [otherElement, hiddenElement, notRequired];
    expect(elementSatisfiesRequired(hiddenElement, elements)).toBeTruthy();
    expect(elementSatisfiesRequired(notRequired, elements)).toBeTruthy();
  });

  test("handles radios", () => {
    const radio = {
      id: "other-element",
      answer: "foo",
      type: ElementType.Radio,
      choices: [
        {
          label: "me",
          value: "me",
        },
      ],
      required: true,
    } as RadioTemplate;
    const incompleteChildren = {
      id: "bad-element",
      answer: "me",
      type: ElementType.Radio,
      choices: [
        {
          label: "me",
          value: "me",
          checkedChildren: [
            {
              type: ElementType.Textbox,
              answer: undefined,
              required: true,
            },
          ],
        },
      ],
      required: true,
    } as RadioTemplate;
    const radios = [radio, incompleteChildren];
    expect(elementSatisfiesRequired(radio, radios)).toBeTruthy();
    expect(elementSatisfiesRequired(incompleteChildren, radios)).toBeFalsy();
  });

  test("accepts complete LengthOfStay rates", () => {
    const element = {
      type: ElementType.LengthOfStayRate,
      answer: {
        actualCount: 2,
        denominator: 3,
        expectedCount: 4,
        populationRate: 5,
        actualRate: 0.67,
        expectedRate: 1.33,
        adjustedRate: 2.52,
      },
      required: true,
    } as LengthOfStayRateTemplate;
    expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
  });

  test.each([
    undefined,
    {},
    {
      actualCount: 2,
      expectedCount: 4,
      populationRate: 5,
      adjustedRate: 2.52,
    },
  ])("rejects incomplete LengthOfStay rates", (answer) => {
    const element = {
      type: ElementType.LengthOfStayRate,
      answer,
      required: true,
    } as LengthOfStayRateTemplate;
    expect(elementSatisfiesRequired(element, [element])).toBeFalsy();
  });

  test("accepts complete NDR rates", () => {
    const element = {
      type: ElementType.Ndr,
      answer: {
        numerator: 1,
        denominator: 3,
        rate: 0.33,
      },
      required: true,
    } as NdrTemplate;
    expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
  });

  test.each([undefined, {}, { numerator: 1, rate: 0.33 }])(
    "rejects incomplete NDR rates",
    (answer) => {
      const element = {
        type: ElementType.Ndr,
        answer,
        required: true,
      } as NdrTemplate;
      expect(elementSatisfiesRequired(element, [element])).toBeFalsy();
    }
  );

  test("accepts complete NDREnhanced rates", () => {
    const element = {
      type: ElementType.NdrEnhanced,
      answer: {
        denominator: 5,
        rates: [
          {
            numerator: 7,
            rate: 1.4,
          },
        ],
      },
      required: true,
    } as NdrEnhancedTemplate;
    expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
  });

  test.each([
    undefined,
    {},
    { rates: [{ numerator: 7, rate: 1.4 }] },
    { denominator: 5, rates: [{ numerator: 7, rate: 1.4 }] },
    { denominator: 5, rates: [{ rate: 1.4 }] },
    { denominator: 5, rates: [{ numerator: 7 }] },
  ])("accepts incomplete NDREnhanced rates", (answer) => {
    const element = {
      type: ElementType.NdrEnhanced,
      answer,
      required: false,
    } as NdrEnhancedTemplate;
    expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
  });

  test("accepts complete NDRFields rates", () => {
    const element = {
      type: ElementType.NdrFields,
      answer: [
        {
          denominator: 5,
          rates: [
            {
              numerator: 7,
              rate: 1.4,
            },
          ],
        },
      ],
      required: true,
    } as NdrFieldsTemplate;
    expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
  });
  test("rejects incomplete  NDRBasic rates", () => {
    const element = {
      id: "mock-id",
      type: ElementType.NdrBasic,
      answer: {
        numerator: 1,
        denominator: 2,
        rate: 50,
      },
      minPerformanceLevel: 90,
      conditionalChildren: [
        {
          type: ElementType.TextAreaField,
          required: true,
        },
      ],
      required: true,
    } as NdrBasicTemplate;
    expect(elementSatisfiesRequired(element, [element])).toBeFalsy();
  });
  test("accepts complete NDRBasic rates", () => {
    const element = {
      id: "mock-id",
      type: ElementType.NdrBasic,
      answer: {
        numerator: 2,
        denominator: 2,
        rate: 100,
      },
      minPerformanceLevel: 90,
      conditionalChildren: [
        {
          type: ElementType.TextAreaField,
          answer: "mock text",
          required: true,
        },
      ],
      required: true,
    } as NdrBasicTemplate;
    expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
  });

  test.each([
    undefined,
    [{}],
    [{ rates: [{ numerator: 7, rate: 1.4 }] }],
    [{ denominator: 5, rates: [{ numerator: 7, rate: 1.4 }] }],
    [{ denominator: 5, rates: [{ rate: 1.4 }] }],
    [{ denominator: 5, rates: [{ numerator: 7 }] }],
  ])("accepts incomplete NDRFields when not required", (answer) => {
    const element = {
      type: ElementType.NdrFields,
      answer,
      required: false, // ← It's not required
    } as unknown as NdrFieldsTemplate;
    expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
  });
  test("reject incomplete ListInput", () => {
    const element = {
      type: ElementType.ListInput,
      required: true,
      answer: [""],
    } as ListInputTemplate;
    expect(elementSatisfiesRequired(element, [element])).toBeFalsy();
  });

  describe("elementSatisfiesRequired - ReadmissionRate", () => {
    const baseReadmissionRateElement: ReadmissionRateTemplate = {
      id: "test-readmission-rate",
      type: ElementType.ReadmissionRate,
      required: true,
      labels: {
        denominatorCol1: "Count of Index Hospital Stays",
        numeratorCol2: "Count of Observed 30-Day Readmissions",
        expectedRateCol3: "Observed Readmission Rate",
        numeratorDenominatorCol4: "Count of Expected 30-Day readmissions",
        expectedRateCol5: "Expected Readmission Rate",
        expectedRateCol6: "Observed-to-Expected Ratio",
        denominatorCol7: "Count of Beneficiaries in Medicaid Population",
        numeratorCol8: "Number of Outliers",
        expectedRateCol9: "Outlier Rate",
      },
    };

    test("returns true when all fields are defined and no errors", () => {
      const element: ReadmissionRateTemplate = {
        ...baseReadmissionRateElement,
        answer: {
          denominatorCol1: 100,
          numeratorCol2: 25,
          expectedRateCol3: 25,
          numeratorDenominatorCol4: 20,
          expectedRateCol5: 20,
          expectedRateCol6: 1.25,
          denominatorCol7: 1000,
          numeratorCol8: 5,
          expectedRateCol9: 5,
        },
      };

      expect(elementSatisfiesRequired(element, [])).toBe(true);
    });

    test("returns false when any field is undefined", () => {
      const element: ReadmissionRateTemplate = {
        ...baseReadmissionRateElement,
        answer: {
          denominatorCol1: 100,
          numeratorCol2: 25,
          expectedRateCol3: undefined,
          numeratorDenominatorCol4: 20,
          expectedRateCol5: 20,
          expectedRateCol6: 1.25,
          denominatorCol7: 1000,
          numeratorCol8: 5,
          expectedRateCol9: 5,
        },
      };

      expect(elementSatisfiesRequired(element, [])).toBe(false);
    });

    test("returns false when errors exist", () => {
      const element: ReadmissionRateTemplate = {
        ...baseReadmissionRateElement,
        answer: {
          denominatorCol1: 0,
          numeratorCol2: 1,
          expectedRateCol3: undefined,
          numeratorDenominatorCol4: 0,
          expectedRateCol5: 0,
          expectedRateCol6: 0,
          denominatorCol7: 0,
          numeratorCol8: 0,
          expectedRateCol9: 0,
        },
        errors: {
          numeratorCol2:
            "Error: Count of Observed 30-Day Readmissions must be 0 when Count of Index Hospital Stays is 0",
          denominatorCol1: "",
          expectedRateCol3: "",
          numeratorDenominatorCol4: "",
          expectedRateCol5: "",
          expectedRateCol6: "",
          denominatorCol7: "",
          numeratorCol8: "",
          expectedRateCol9: "",
        },
      };

      expect(elementSatisfiesRequired(element, [])).toBe(false);
    });

    test("returns true when errors object exists but all error values are empty strings", () => {
      const element: ReadmissionRateTemplate = {
        ...baseReadmissionRateElement,
        answer: {
          denominatorCol1: 100,
          numeratorCol2: 25,
          expectedRateCol3: 25,
          numeratorDenominatorCol4: 20,
          expectedRateCol5: 20,
          expectedRateCol6: 1.25,
          denominatorCol7: 1000,
          numeratorCol8: 5,
          expectedRateCol9: 5,
        },
        errors: {
          denominatorCol1: "",
          numeratorCol2: "",
          expectedRateCol3: "",
          numeratorDenominatorCol4: "",
          expectedRateCol5: "",
          expectedRateCol6: "",
          denominatorCol7: "",
          numeratorCol8: "",
          expectedRateCol9: "",
        },
      };

      expect(elementSatisfiesRequired(element, [])).toBe(true);
    });

    test("returns true when all fields are 0 (0/0 case)", () => {
      const element: ReadmissionRateTemplate = {
        ...baseReadmissionRateElement,
        answer: {
          denominatorCol1: 0,
          numeratorCol2: 0,
          expectedRateCol3: 0,
          numeratorDenominatorCol4: 0,
          expectedRateCol5: 0,
          expectedRateCol6: 0,
          denominatorCol7: 0,
          numeratorCol8: 0,
          expectedRateCol9: 0,
        },
      };

      expect(elementSatisfiesRequired(element, [])).toBe(true);
    });
  });
});
