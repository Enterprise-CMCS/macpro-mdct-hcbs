import { ReportState } from "types";
import {
  ElementType,
  MeasurePageTemplate,
  PageStatus,
  MeasureTemplateName,
  PageType,
  Report,
  ReportStatus,
  ReportType,
  TextboxTemplate,
  FormPageTemplate,
  RadioTemplate,
} from "types/report";
import {
  buildState,
  clearMeasure,
  mergeAnswers,
  resetMeasure,
  setPage,
  substitute,
  saveReport,
  markPageComplete,
  changeDeliveryMethods,
  deepEquals,
  deepMerge,
} from "./reportActions";
import {
  mock2MeasureTemplate,
  mockMeasureTemplateNotReporting,
} from "utils/testing/setupJest";

jest.mock("../../api/requestMethods/report", () => ({
  putReport: jest.fn(),
}));
const testReport: Report = {
  type: ReportType.XYZ,
  name: "plan id",
  year: 2026,
  options: {},
  state: "NJ",
  id: "NJXYZ123",
  status: ReportStatus.NOT_STARTED,
  archived: false,
  submissionCount: 0,
  pages: [
    {
      id: "root",
      childPageIds: ["general-info", "req-measure-result"],
    },
    {
      id: "general-info",
      title: "General Information",
      type: PageType.Standard,
      status: PageStatus.NOT_STARTED,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "",
          text: "General Information",
        },
        {
          type: ElementType.Textbox,
          id: "",
          label: "Contact title",
          required: true,
          helperText:
            "Enter person's title or a position title for CMS to contact with questions about this request.",
        },
      ],
    },
    {
      id: "req-measure-result",
      title: "Required Measure Results",
      type: PageType.Standard,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "",
          text: "Required Measure Results",
        },
      ],
    },
    {
      id: "FFS-1",
      title: "FFS",
      type: PageType.MeasureResults,
      status: PageStatus.IN_PROGRESS,
      sidebar: true,
      elements: [
        {
          type: ElementType.Header,
          id: "header",
          text: "FFS page",
        },
      ],
    },
    mockMeasureTemplateNotReporting,
    mock2MeasureTemplate,
  ],
};

describe("reportActions", () => {
  describe("state/management/reportState: buildState", () => {
    test("initializes relevant parts of the state", () => {
      const result = buildState(testReport, false);
      expect(result.pageMap!.size).toEqual(6);
      expect(result.report).not.toBeUndefined();
      expect(result.rootPage).not.toBeUndefined();
      expect(result.parentPage?.parent).toEqual("root");
      expect(result.currentPageId).toEqual("general-info");
    });

    test("returns early when no report provided", () => {
      const result = buildState(undefined, false);
      expect(result.report).toBeUndefined();
    });
  });

  describe("state/management/reportState: setPage", () => {
    test("updates the page info", () => {
      const state = buildState(testReport, false) as ReportState;
      const result = setPage("req-measure-result", state);
      expect(result.currentPageId).toEqual("req-measure-result");
    });
  });

  describe("deepEquals", () => {
    test("Rejects values with different types", () => {
      const obj1 = { foo: "123" };
      const obj2 = { foo: 123 };
      expect(deepEquals(obj1, obj2)).toBe(false);
      expect(deepEquals(obj2, obj1)).toBe(false);
    });

    test("Rejects arrays with different lengths", () => {
      const obj1 = [1, 2, 3];
      const obj2 = [1, 2];
      expect(deepEquals(obj1, obj2)).toBe(false);
      expect(deepEquals(obj2, obj1)).toBe(false);
    });

    test("Rejects arrays with different contents", () => {
      const obj1 = ["a", "b", "c"];
      const obj2 = ["a", "b", "x"];
      expect(deepEquals(obj1, obj2)).toBe(false);
      expect(deepEquals(obj2, obj1)).toBe(false);
    });

    test("Rejects objects with different shapes", () => {
      const obj1 = { foo: "bar" };
      const obj2 = { foo: "bar", baz: "quux" };
      expect(deepEquals(obj1, obj2)).toBe(false);
      expect(deepEquals(obj2, obj1)).toBe(false);
    });

    test("Rejects an object and null", () => {
      // null is a special case because `typeof null === "object"`
      const obj1 = { foo: "bar" };
      const obj2 = null;
      expect(deepEquals(obj1, obj2)).toBe(false);
      expect(deepEquals(obj2, obj1)).toBe(false);
    });

    test("Accepts NaN and NaN", () => {
      // NaN is a special case because `(NaN === NaN) === false`
      const obj1 = NaN;
      const obj2 = NaN;
      expect(deepEquals(obj1, obj2)).toBe(true);
    });

    test("Accepts normal values", () => {
      const obj1 = {
        bool: true,
        num: 123,
        obj: { foo: "bar" },
        str: "hello",
        nul: null,
        arr: [1, 2, 3],
      };
      const obj2 = deepMerge(obj1, {});
      expect(deepEquals(obj1, obj2)).toBe(true);
      expect(deepEquals(obj2, obj1)).toBe(true);
    });

    test("Accepts weird values", () => {
      /*
       * I call these values are "weird" because JSON.stringify mangles them.
       * That makes testing difficult, since we mock structuredClone with JSON,
       * and our answer-merging code relies on structuredClone.
       */
      const obj1 = {
        bigint: 456n,
        undef: undefined,
        nan: NaN,
        negz: -0,
        inf: Infinity,
        dat: new Date(2025, 8, 1),
      };
      const obj2 = {
        bigint: 456n,
        undef: undefined,
        nan: NaN,
        negz: -0,
        inf: Infinity,
        dat: new Date(2025, 8, 1),
      };
      expect(deepEquals(obj1, obj2)).toBe(true);
    });

    test("Rejects really weird values", () => {
      /*
       * For symbols and functions, identical definitions yield unequal objects.
       * That's really weird, you might say.
       * If we ever embed functions or symbols into report bodies,
       * we may have to write special-case code to handle these.
       */
      expect(deepEquals({ x: Symbol("💿") }, { x: Symbol("💿") })).toBe(false);
      expect(deepEquals({ x: () => {} }, { x: () => {} })).toBe(false);
    });
  });

  describe("state/management/reportState: mergeAnswers", () => {
    test("Adds answers to a question", () => {
      // Jest is garbage
      global.structuredClone = (val: unknown) => {
        return JSON.parse(JSON.stringify(val));
      };

      const state = buildState(testReport, false) as ReportState;

      const answers = { elements: [null, { answer: "ANSWERED" }] };
      const result = mergeAnswers(answers, state);

      const page = result?.report?.pages[1] as FormPageTemplate;
      const elements = page?.elements!;
      const question = elements[1] as TextboxTemplate;
      expect(page.status).toEqual(PageStatus.IN_PROGRESS);
      expect(question.answer).toEqual("ANSWERED");
    });
  });

  describe("state/management/reportState: substitute", () => {
    test("substitute the measure", () => {
      const response = substitute(testReport, mockMeasureTemplateNotReporting);
      const measure = response.report.pages[4] as MeasurePageTemplate;
      expect(measure.required).toBe(false);
    });
  });

  describe("state/management/reportState: resetMeasure", () => {
    test("reset measure", async () => {
      global.structuredClone = (val: unknown) => {
        return JSON.parse(JSON.stringify(val));
      };

      const state = buildState(testReport, false) as ReportState;
      const response = resetMeasure("LTSS-1", state);
      const measure = response!.report!.pages[4] as MeasurePageTemplate;
      const reportingRadio = measure.elements[0] as RadioTemplate;
      const question = measure.elements[1] as TextboxTemplate;

      expect(measure.status).toBe(PageStatus.NOT_STARTED);
      expect(reportingRadio.answer).toBeFalsy();
      expect(question.answer).toBeFalsy();
    });
  });

  describe("state/management/reportState: clearMeasure", () => {
    test("clear measure", async () => {
      global.structuredClone = (val: unknown) => {
        return JSON.parse(JSON.stringify(val));
      };

      const state = buildState(testReport, false) as ReportState;
      const response = clearMeasure("LTSS-1", state, {
        ["measure-reporting-radio"]: "no",
      });
      const measure = response!.report!.pages[4] as MeasurePageTemplate;
      const reportingRadio = measure.elements[0] as RadioTemplate;
      const question = measure.elements[1] as TextboxTemplate;

      expect(measure.status).toBe(PageStatus.IN_PROGRESS);
      expect(reportingRadio.answer).toBe("no");
      expect(question.answer).toBeFalsy();
    });
  });

  describe("state/management/reportState: markPageComplete", () => {
    test("complete measure", async () => {
      global.structuredClone = (val: unknown) => {
        return JSON.parse(JSON.stringify(val));
      };

      const state = buildState(testReport, false) as ReportState;
      const response = markPageComplete("LTSS-1", state);
      const measure = response!.report!.pages[4] as MeasurePageTemplate;

      expect(measure.status).toBe(PageStatus.COMPLETE);
    });
  });

  describe("state/management/reportState: saveReport", () => {
    test("updates store on success", async () => {
      const state = buildState(testReport, false) as ReportState;
      const result = await saveReport(state);
      expect(result?.lastSavedTime).toBeTruthy();
    });
  });

  describe("state/management/reportState: changeDeliveryMethods", () => {
    test("should clear unused methods", async () => {
      global.structuredClone = (val: unknown) => {
        return JSON.parse(JSON.stringify(val));
      };

      const state = buildState(testReport, false) as ReportState;
      const response = changeDeliveryMethods("LTSS-1", "MLTSS", state);
      const ffs = response.report?.pages.find(
        (page) => page.id === MeasureTemplateName["FFS-1"]
      ) as MeasurePageTemplate;

      expect(ffs!.status).toBe(PageStatus.NOT_STARTED);
    });
    test("should ignore used methods", async () => {
      global.structuredClone = (val: unknown) => {
        return JSON.parse(JSON.stringify(val));
      };

      const state = buildState(testReport, false) as ReportState;
      const response = changeDeliveryMethods("LTSS-1", "FFS", state);
      const ffs = response.report?.pages.find(
        (page) => page.id === MeasureTemplateName["FFS-1"]
      ) as MeasurePageTemplate;

      expect(ffs!.status).toBe(PageStatus.IN_PROGRESS);
    });
  });
});
