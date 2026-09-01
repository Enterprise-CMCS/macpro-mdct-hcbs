import { describe, expect, it } from "vitest";
import {
  CheckboxTemplate,
  DateRangeTemplate,
  ElementType,
  KeyActivityTableTemplate,
  LengthOfStayRateTemplate,
  ListInputTemplate,
  MeasurePageTemplate,
  PerformanceNdrTemplate,
  MultiRateNdrTemplate,
  MultiCategoryNdrTemplate,
  NdrTemplate,
  PageElement,
  PageStatus,
  PageType,
  RadioTemplate,
  Report,
  TextboxTemplate,
  PageTemplate,
  ReadmissionRateTemplate,
} from "types";
import {
  elementSatisfiesRequired,
  inferredReportStatus,
  pageInProgress,
  pageIsCompletable,
} from "./completeness";

describe("Report completeness utilities", () => {
  describe("inferredReportStatus", () => {
    it("should handle different rollup types", () => {
      const report = {
        pages: [
          {
            id: "my-id",
            cmitId: "MyCmit",
            navTitle: "a title",
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
            navTitle: "a title",
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
            navTitle: "a title",
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
      expect(inferredReportStatus(report, "my-id")).toEqual(
        PageStatus.COMPLETE
      );
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

    it("should treat any mix of required measure statuses as In Progress", () => {
      const buildReport = (requiredMeasureStatuses: PageStatus[]) =>
        ({
          pages: [
            { id: "req-measure-result" },
            ...requiredMeasureStatuses.map((status) => ({
              type: PageType.Measure,
              required: true,
              status,
            })),
          ],
        }) as Report;

      const testCases = [
        [PageStatus.NOT_STARTED, PageStatus.IN_PROGRESS],
        [PageStatus.NOT_STARTED, PageStatus.COMPLETE],
        [PageStatus.IN_PROGRESS, PageStatus.COMPLETE],
        [PageStatus.IN_PROGRESS],
      ];

      for (let statusCombinations of testCases) {
        expect(
          inferredReportStatus(
            buildReport(statusCombinations),
            "req-measure-result"
          )
        ).toEqual(PageStatus.IN_PROGRESS);
      }
    });

    it("should treat a set of Not Started required measures as Not Started", () => {
      const report = {
        pages: [
          { id: "req-measure-result" },
          {
            type: PageType.Measure,
            required: true,
            status: PageStatus.NOT_STARTED,
          },
          {
            type: PageType.Measure,
            required: true,
            status: PageStatus.NOT_STARTED,
          },
        ],
      } as Report;

      expect(inferredReportStatus(report, "req-measure-result")).toEqual(
        PageStatus.NOT_STARTED
      );
    });

    it("should treat a set of Not Started or Complete optional measures as Complete", () => {
      const report = {
        pages: [
          { id: "optional-measure-result" },
          {
            type: PageType.Measure,
            required: false,
            status: PageStatus.NOT_STARTED,
          },
          {
            type: PageType.Measure,
            required: false,
            status: PageStatus.COMPLETE,
          },
        ],
      } as Report;

      expect(inferredReportStatus(report, "optional-measure-result")).toEqual(
        PageStatus.COMPLETE
      );
    });

    it.each([
      { inputs: [], expected: PageStatus.NOT_STARTED },
      { inputs: [PageStatus.NOT_STARTED], expected: PageStatus.NOT_STARTED },
      { inputs: [PageStatus.IN_PROGRESS], expected: PageStatus.IN_PROGRESS },
      { inputs: [PageStatus.COMPLETE], expected: PageStatus.COMPLETE },
      {
        inputs: [PageStatus.NOT_STARTED, PageStatus.IN_PROGRESS],
        expected: PageStatus.IN_PROGRESS,
      },
      {
        inputs: [PageStatus.NOT_STARTED, PageStatus.COMPLETE],
        expected: PageStatus.IN_PROGRESS,
      },
      {
        inputs: [PageStatus.IN_PROGRESS, PageStatus.COMPLETE],
        expected: PageStatus.IN_PROGRESS,
      },
      {
        inputs: [
          PageStatus.NOT_STARTED,
          PageStatus.IN_PROGRESS,
          PageStatus.COMPLETE,
        ],
        expected: PageStatus.IN_PROGRESS,
      },
    ])(
      "should correctly combine target measure statuses: $inputs => $expected",
      ({ inputs, expected }) => {
        const report = {
          pages: [
            {
              id: "select-measures",
              elements: [
                {
                  type: ElementType.QipMeasureTable,
                  id: "select-measures-table",
                  answer: [] as any,
                },
              ],
            },
          ],
        } as Report;

        const addPage = (status: PageStatus) => {
          const id = "id-" + report.pages.length;
          let page;
          switch (status) {
            case PageStatus.NOT_STARTED:
              page = {
                id,
                elements: [{ type: ElementType.Textbox, required: true }],
              };
              break;
            case PageStatus.IN_PROGRESS:
              page = {
                id,
                elements: [
                  { type: ElementType.Textbox, required: true, answer: "foo" },
                  { type: ElementType.Textbox, required: true },
                ],
              };
              break;
            case PageStatus.COMPLETE:
              page = {
                id,
                elements: [
                  { type: ElementType.Textbox, required: true, answer: "foo" },
                ],
              };
              break;
          }
          (report.pages[0].elements![0] as any).answer!.push({ pageId: id });
          report.pages.push(page as PageTemplate);
        };

        for (let inputStatus of inputs) {
          addPage(inputStatus);
        }

        expect(inferredReportStatus(report, "select-measures")).toBe(expected);
      }
    );
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
    it("should handle empty conditions", () => {
      const missingPageReport = {
        pages: [] as MeasurePageTemplate[],
      } as Report;
      expect(pageIsCompletable(missingPageReport, "my-id")).toBeFalsy();

      const noElementsOnPage = {
        pages: [{ id: "my-id" }],
      } as Report;
      expect(pageIsCompletable(noElementsOnPage, "my-id")).toBeTruthy();
    });

    it("should return false for an incomplete element", () => {
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

    it("should return false when dependent page is incomplete", () => {
      const report = {
        pages: [
          {
            id: "my-id",
            navTitle: "my title",
            status: PageStatus.IN_PROGRESS,
            type: PageType.Measure,
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
            navTitle: "child title",
            status: PageStatus.IN_PROGRESS,
            type: PageType.MeasureResults,
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

    it("should return true for a complete element", () => {
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
    it("should return true when hidden or not required", () => {
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

    it("should handle radios", () => {
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

    it("should handle checkboxes", () => {
      const checkbox = {
        id: "checkbox-element",
        answer: ["foo"],
        type: ElementType.Checkbox,
        choices: [
          {
            label: "me",
            value: "foo",
          },
        ],
        required: true,
      } as CheckboxTemplate;
      const incompleteChildren = {
        id: "bad-checkbox-element",
        answer: ["foo"],
        type: ElementType.Checkbox,
        choices: [
          {
            label: "me",
            value: "foo",
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
      } as CheckboxTemplate;
      const checkboxes = [checkbox, incompleteChildren];
      expect(elementSatisfiesRequired(checkbox, checkboxes)).toBeTruthy();
      expect(
        elementSatisfiesRequired(incompleteChildren, checkboxes)
      ).toBeFalsy();
    });

    it("should handle checkboxes with multiple selections", () => {
      const completeCheckbox = {
        id: "multi-checkbox",
        answer: ["option1", "option2"],
        type: ElementType.Checkbox,
        choices: [
          {
            label: "Option 1",
            value: "option1",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                answer: "filled",
                required: true,
              },
            ],
          },
          {
            label: "Option 2",
            value: "option2",
            checkedChildren: [
              {
                type: ElementType.TextAreaField,
                answer: "also filled",
                required: true,
              },
            ],
          },
        ],
        required: true,
      } as CheckboxTemplate;

      const incompleteCheckbox = {
        id: "multi-checkbox-incomplete",
        answer: ["option1", "option2"],
        type: ElementType.Checkbox,
        choices: [
          {
            label: "Option 1",
            value: "option1",
            checkedChildren: [
              {
                type: ElementType.Textbox,
                answer: "filled",
                required: true,
              },
            ],
          },
          {
            label: "Option 2",
            value: "option2",
            checkedChildren: [
              {
                type: ElementType.TextAreaField,
                answer: undefined,
                required: true,
              },
            ],
          },
        ],
        required: true,
      } as CheckboxTemplate;

      expect(
        elementSatisfiesRequired(completeCheckbox, [completeCheckbox])
      ).toBeTruthy();
      expect(
        elementSatisfiesRequired(incompleteCheckbox, [incompleteCheckbox])
      ).toBeFalsy();
    });

    it("should accept complete LengthOfStay rates", () => {
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

    it.each([
      undefined,
      {},
      {
        actualCount: 2,
        expectedCount: 4,
        populationRate: 5,
        adjustedRate: 2.52,
      },
    ])("should reject incomplete LengthOfStay rates", (answer) => {
      const element = {
        type: ElementType.LengthOfStayRate,
        answer,
        required: true,
      } as LengthOfStayRateTemplate;
      expect(elementSatisfiesRequired(element, [element])).toBeFalsy();
    });

    it("should accept complete NDR rates", () => {
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

    it.each([undefined, {}, { numerator: 1, rate: 0.33 }])(
      "should reject incomplete NDR rates",
      (answer) => {
        const element = {
          type: ElementType.Ndr,
          answer,
          required: true,
        } as NdrTemplate;
        expect(elementSatisfiesRequired(element, [element])).toBeFalsy();
      }
    );

    it("should accept complete DateRange", () => {
      const element = {
        type: ElementType.DateRange,
        id: "date-range",
        labels: {
          top: "Date range",
          start: "Start date",
          end: "End date",
        },
        answer: {
          start: "01/01/2026",
          end: "01/31/2026",
        },
        required: true,
      } as DateRangeTemplate;
      expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
    });

    it.each([undefined, {}, { start: "2026-01-01" }, { end: "2026-01-31" }])(
      "should reject incomplete DateRange",
      (answer) => {
        const element = {
          type: ElementType.DateRange,
          id: "date-range",
          labels: {
            top: "Date range",
            start: "Start date",
            end: "End date",
          },
          answer,
          required: true,
        } as DateRangeTemplate;
        expect(elementSatisfiesRequired(element, [element])).toBeFalsy();
      }
    );

    it("should accept DateRange with missing end when endDateRequired is false", () => {
      const element = {
        type: ElementType.DateRange,
        id: "date-range",
        labels: {
          top: "Date range",
          start: "Start date",
          end: "End date",
        },
        answer: {
          start: "01/2026",
        },
        dateFormat: "MMYYYY",
        required: true,
        endDateRequired: false,
      } as DateRangeTemplate;

      expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
    });

    it("should accept complete MultiRateNdr elements", () => {
      const element = {
        type: ElementType.MultiRateNdr,
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
      } as MultiRateNdrTemplate;
      expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
    });

    it.each([
      undefined,
      {},
      { rates: [{ numerator: 7, rate: 1.4 }] },
      { denominator: 5, rates: [{ numerator: 7, rate: 1.4 }] },
      { denominator: 5, rates: [{ rate: 1.4 }] },
      { denominator: 5, rates: [{ numerator: 7 }] },
    ])("should accept incomplete MultiRateNdr elements", (answer) => {
      const element = {
        type: ElementType.MultiRateNdr,
        answer,
        required: false,
      } as MultiRateNdrTemplate;
      expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
    });

    it("should accept complete multiCategoryNdr elements", () => {
      const element = {
        type: ElementType.MultiCategoryNdr,
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
      } as MultiCategoryNdrTemplate;
      expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
    });

    it("should reject incomplete PerformanceNdr rates", () => {
      const element = {
        id: "mock-id",
        type: ElementType.PerformanceNdr,
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
      } as PerformanceNdrTemplate;
      expect(elementSatisfiesRequired(element, [element])).toBeFalsy();
    });
    it("should accept complete PerformanceNdr rates", () => {
      const element = {
        id: "mock-id",
        type: ElementType.PerformanceNdr,
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
      } as PerformanceNdrTemplate;
      expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
    });

    it.each([
      undefined,
      [{}],
      [{ rates: [{ numerator: 7, rate: 1.4 }] }],
      [{ denominator: 5, rates: [{ numerator: 7, rate: 1.4 }] }],
      [{ denominator: 5, rates: [{ rate: 1.4 }] }],
      [{ denominator: 5, rates: [{ numerator: 7 }] }],
    ])(
      "should accept incomplete MultiCategoryNdr elements when optional",
      (answer) => {
        const element = {
          type: ElementType.MultiCategoryNdr,
          answer,
          required: false, // ← It's not required
        } as unknown as MultiCategoryNdrTemplate;
        expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
      }
    );

    it("should reject incomplete ListInput", () => {
      const element = {
        type: ElementType.ListInput,
        required: true,
        answer: [""],
      } as ListInputTemplate;
      expect(elementSatisfiesRequired(element, [element])).toBeFalsy();
    });

    it.each([
      ["no entries", []],
      ["no answer", undefined],
    ])("should reject required KeyActivityTable with %s", (_, answer) => {
      const element = {
        type: ElementType.KeyActivityTable,
        id: "key-activities-table",
        caption: "Key Activities",
        required: true,
        answer,
      } as KeyActivityTableTemplate;
      expect(elementSatisfiesRequired(element, [element])).toBeFalsy();
    });

    it("should accept required KeyActivityTable with at least one entry", () => {
      const element = {
        type: ElementType.KeyActivityTable,
        id: "key-activities-table",
        caption: "Key Activities",
        required: true,
        answer: [{ id: "1", title: "Some Activity" }],
      } as KeyActivityTableTemplate;
      expect(elementSatisfiesRequired(element, [element])).toBeTruthy();
    });

    it("should reject ReadmissionRate with errors", () => {
      const element = {
        type: ElementType.ReadmissionRate,
        required: true,
        errors: { stayCount: "Mock error message" },
        answer: {
          stayCount: 42,
          obsReadmissionCount: 42,
          obsReadmissionRate: 42,
          expReadmissionCount: 42,
          expReadmissionRate: 42,
          obsExpRatio: 42,
          beneficiaryCount: 42,
          outlierCount: 42,
          outlierRate: 42,
        },
      } as ReadmissionRateTemplate;
      expect(elementSatisfiesRequired(element, [element])).toBe(false);
    });

    it("should reject ReadmissionRate with missing fields", () => {
      const element = {
        type: ElementType.ReadmissionRate,
        required: true,
        answer: {
          stayCount: 42,
          obsReadmissionCount: 42,
          obsReadmissionRate: 42,
          expReadmissionCount: 42,
          expReadmissionRate: 42,
          obsExpRatio: 42,
          beneficiaryCount: 42,
          outlierCount: undefined,
          outlierRate: 42,
        },
      } as ReadmissionRateTemplate;
      expect(elementSatisfiesRequired(element, [element])).toBe(false);
    });

    it("should accept complete ReadmissionRate", () => {
      const element = {
        type: ElementType.ReadmissionRate,
        required: true,
        answer: {
          stayCount: 42,
          obsReadmissionCount: 42,
          obsReadmissionRate: 42,
          expReadmissionCount: 42,
          expReadmissionRate: 42,
          obsExpRatio: 42,
          beneficiaryCount: 42,
          outlierCount: 42,
          outlierRate: 42,
        },
      } as ReadmissionRateTemplate;
      expect(elementSatisfiesRequired(element, [element])).toBe(true);
    });
  });
});
