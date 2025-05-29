import {
  ElementType,
  LengthOfStayRateFields,
  LengthOfStayRateTemplate,
  MeasurePageTemplate,
  PageStatus,
  PageType,
  PerformanceRateTemplate,
  PerformanceRateType,
  RadioTemplate,
  RateSetData,
  Report,
  TextboxTemplate,
} from "types";
import {
  elementSatisfiesRequired,
  inferredReportStatus,
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
    };
    const otherElement: TextboxTemplate = {
      id: "other-element",
      label: "irrelevant other textbox",
      answer: "foo",
      type: ElementType.Textbox,
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

  test("handles rates", () => {
    const goodRateA = {
      id: "good-rate",
      type: ElementType.PerformanceRate,
      required: true,
      rateType: PerformanceRateType.NDR,
      answer: { rates: [{ performanceTarget: 1, rate: 15 }] }, // when calculating finished has rate
    } as PerformanceRateTemplate;
    const goodRateB = {
      id: "good-rate-b",
      type: ElementType.PerformanceRate,
      required: true,
      rateType: PerformanceRateType.NDR,
      answer: [{ rates: [{ performanceTarget: 1, rate: 15 }] }], // when calculating finished has rate
    } as PerformanceRateTemplate;
    const fieldsRate = {
      id: "field-rate",
      type: ElementType.LengthOfStayRate,
      required: true,
      labels: Object.fromEntries(
        LengthOfStayRateFields.map((field) => [field, "label"])
      ),
      answer: Object.fromEntries(
        LengthOfStayRateFields.map((field) => [field, 42])
      ),
    } as LengthOfStayRateTemplate;
    const badRate = {
      id: "bad-rate",
      type: ElementType.PerformanceRate,
      required: true,
      rateType: PerformanceRateType.NDR,
    } as PerformanceRateTemplate;
    const badNDRFieldRate = {
      id: "bad-ndr-field-rate",
      type: ElementType.PerformanceRate,
      required: true,
      rateType: PerformanceRateType.NDR_FIELDS,
      fields: [{ label: "abc", id: "abc" }],
      answer: [
        {
          id: "mock-id",
          label: "abc",
          rates: [
            {
              label: "abc",
              performanceTarget: undefined,
            },
          ],
        },
      ] as RateSetData[],
    } as PerformanceRateTemplate;
    const elements = [goodRateA, goodRateB, badRate];
    expect(elementSatisfiesRequired(goodRateA, elements)).toBeTruthy();
    expect(elementSatisfiesRequired(goodRateB, elements)).toBeTruthy();
    expect(elementSatisfiesRequired(fieldsRate, elements)).toBeTruthy();
    expect(elementSatisfiesRequired(badRate, elements)).toBeFalsy();
    expect(elementSatisfiesRequired(badNDRFieldRate, elements)).toBeFalsy();
  });
});
