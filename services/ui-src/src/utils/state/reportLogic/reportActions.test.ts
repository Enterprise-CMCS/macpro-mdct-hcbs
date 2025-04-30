import { HcbsReportState } from "types";
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
  filterErrors,
  markPageComplete,
  changeDeliveryMethods,
} from "./reportActions";
import {
  mock2MeasureTemplate,
  mockMeasureTemplateNotReporting,
} from "utils/testing/setupJest";

jest.mock("../../api/requestMethods/report", () => ({
  putReport: jest.fn(),
}));
const testReport: Report = {
  type: ReportType.QMS,
  name: "plan id",
  year: 2026,
  options: {},
  state: "NJ",
  id: "NJQMS123",
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
    const state = buildState(testReport, false) as HcbsReportState;
    const result = setPage("req-measure-result", state);
    expect(result.currentPageId).toEqual("req-measure-result");
  });
});

describe("state/management/reportState: mergeAnswers", () => {
  test("Adds answers to a question", () => {
    // Jest is garbage
    global.structuredClone = (val: unknown) => {
      return JSON.parse(JSON.stringify(val));
    };

    const state = buildState(testReport, false) as HcbsReportState;

    const answers = { elements: [null, { answer: "ANSWERED" }] };
    const result = mergeAnswers(answers, state);

    const page = result?.report.pages[1] as FormPageTemplate;
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

    const state = buildState(testReport, false) as HcbsReportState;
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

    const state = buildState(testReport, false) as HcbsReportState;
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

    const state = buildState(testReport, false) as HcbsReportState;
    const response = markPageComplete("LTSS-1", state);
    const measure = response!.report!.pages[4] as MeasurePageTemplate;

    expect(measure.status).toBe(PageStatus.COMPLETE);
  });
});

describe("state/management/reportState: saveReport", () => {
  test("updates store on success", async () => {
    const state = buildState(testReport, false) as HcbsReportState;
    const result = await saveReport(state);
    expect(result?.lastSavedTime).toBeTruthy();
  });
});

describe("state/management/reportState: filterErrors", () => {
  test("removes errored entries from answers", async () => {
    global.structuredClone = (val: unknown) => {
      return JSON.parse(JSON.stringify(val));
    };

    const answers = { elements: [{ answer: "dog" }, { answer: "cat" }] };
    const errors = { elements: [{ answer: { message: "No dog allowed" } }] };

    const result = filterErrors(answers, errors);

    expect("answer" in result.elements).toBeFalsy();
    expect(result.elements[1].answer).toBe("cat");
  });
});

describe("state/management/reportState: changeDeliveryMethods", () => {
  test("should clear unused methods", async () => {
    global.structuredClone = (val: unknown) => {
      return JSON.parse(JSON.stringify(val));
    };

    const state = buildState(testReport, false) as HcbsReportState;
    const response = changeDeliveryMethods("LTSS-1", "MLTSS", state);
    const ffs = response!.report.pages.find(
      (page) => page.id === MeasureTemplateName["FFS-1"]
    ) as MeasurePageTemplate;

    expect(ffs!.status).toBe(PageStatus.NOT_STARTED);
  });
  test("should ignore used methods", async () => {
    global.structuredClone = (val: unknown) => {
      return JSON.parse(JSON.stringify(val));
    };

    const state = buildState(testReport, false) as HcbsReportState;
    const response = changeDeliveryMethods("LTSS-1", "FFS", state);
    const ffs = response!.report.pages.find(
      (page) => page.id === MeasureTemplateName["FFS-1"]
    ) as MeasurePageTemplate;

    expect(ffs!.status).toBe(PageStatus.IN_PROGRESS);
  });
});
