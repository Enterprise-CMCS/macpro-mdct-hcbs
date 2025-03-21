import { HcbsReportState } from "types";
import {
  ElementType,
  MeasurePageTemplate,
  MeasureStatus,
  MeasureTemplateName,
  PageType,
  Report,
  ReportingRadioTemplate,
  ReportStatus,
  ReportType,
  TextboxTemplate,
} from "types/report";
import {
  buildState,
  clearMeasure,
  mergeAnswers,
  resetMeasure,
  setPage,
  substitute,
  saveReport,
} from "./reportState";
import {
  mock2MeasureTemplate,
  mockMeasureTemplateNotReporting,
} from "utils/testing/setupJest";

jest.mock("../../api/requestMethods/report", () => ({
  putReport: jest.fn(),
}));
const testReport: Report = {
  type: ReportType.QMS,
  title: "plan id",
  year: 2026,
  options: {},
  state: "NJ",
  id: "NJQMS123",
  status: ReportStatus.NOT_STARTED,
  pages: [
    {
      id: "root",
      childPageIds: ["general-info", "req-measure-result"],
    },
    {
      id: "general-info",
      title: "General Information",
      type: PageType.Standard,
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
    mockMeasureTemplateNotReporting,
    mock2MeasureTemplate,
  ],
  measureLookup: { defaultMeasures: [], optionGroups: {} },
  measureTemplates: {
    [MeasureTemplateName["LTSS-1"]]: {
      id: "req-measure-report",
      title: "Example Measure",
      type: PageType.Measure,
      sidebar: false,
      elements: [
        {
          type: ElementType.ButtonLink,
          label: "Return to Required Measures Results Dashboard",
          to: "req-measure-result",
        },
        {
          type: ElementType.MeasureResultsNavigationTable,
          measureDisplay: "quality",
        },
      ],
    } as MeasurePageTemplate,
    [MeasureTemplateName["FFS-1"]]: {
      id: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      title: "",
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["MLTSS-1"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["LTSS-2"]]: {
      id: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      title: "",
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["FFS-2"]]: {
      id: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      title: "",
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["MLTSS-2"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["LTSS-3"]]: {
      id: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      title: "",
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["FFS-3"]]: {
      id: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      title: "",
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["MLTSS-3"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["LTSS-6"]]: {
      id: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      title: "",
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["LTSS-7"]]: {
      id: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      title: "",
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["LTSS-8"]]: {
      id: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      title: "",
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["POM-1"]]: {
      id: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      title: "",
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["POM-2"]]: {
      id: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      title: "",
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["POM-3"]]: {
      id: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      title: "",
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["POM-4"]]: {
      id: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      title: "",
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["POM-5"]]: {
      id: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      title: "",
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["POM-6"]]: {
      id: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      title: "",
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["POM-7"]]: {
      id: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      title: "",
      type: PageType.Measure,
      elements: [],
    },
  } as Record<MeasureTemplateName, MeasurePageTemplate>,
};

describe("state/management/reportState: buildState", () => {
  test("initializes relevant parts of the state", () => {
    const result = buildState(testReport);
    expect(result.pageMap!.size).toEqual(5);
    expect(result.report).not.toBeUndefined();
    expect(result.rootPage).not.toBeUndefined();
    expect(result.parentPage?.parent).toEqual("root");
    expect(result.currentPageId).toEqual("general-info");
  });

  test("returns early when no report provided", () => {
    const result = buildState(undefined);
    expect(result.report).toBeUndefined();
  });
});

describe("state/management/reportState: setPage", () => {
  test("updates the page info", () => {
    const state = buildState(testReport) as unknown as HcbsReportState;
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

    const state = buildState(testReport) as unknown as HcbsReportState;

    const answers = { elements: [null, { answer: "ANSWERED" }] };
    const result = mergeAnswers(answers, state);

    const page = result?.report.pages[1];
    const elements = page?.elements!;
    const question = elements[1] as TextboxTemplate;
    expect(question.answer).toEqual("ANSWERED");
  });
});

describe("state/management/reportState: substitute", () => {
  test("substitute the measure", () => {
    const response = substitute(testReport, mockMeasureTemplateNotReporting);
    const measure = response.report.pages[3] as MeasurePageTemplate;
    expect(measure.required).toBe(false);
  });
});

describe("state/management/reportState: resetMeasure", () => {
  test("reset measure", async () => {
    global.structuredClone = (val: unknown) => {
      return JSON.parse(JSON.stringify(val));
    };

    const state = buildState(testReport) as unknown as HcbsReportState;
    const response = resetMeasure("LTSS-1", state);
    const measure = response!.report!.pages[3] as MeasurePageTemplate;
    const reportingRadio = measure.elements[0] as ReportingRadioTemplate;
    const question = measure.elements[1] as TextboxTemplate;

    expect(measure.status).toBe(MeasureStatus.NOT_STARTED);
    expect(reportingRadio.answer).toBeFalsy();
    expect(question.answer).toBeFalsy();
  });
});

describe("state/management/reportState: clearMeasure", () => {
  test("clear measure", async () => {
    global.structuredClone = (val: unknown) => {
      return JSON.parse(JSON.stringify(val));
    };

    const state = buildState(testReport) as unknown as HcbsReportState;
    const response = clearMeasure("LTSS-1", state, ["measure-reporting-radio"]);
    const measure = response!.report!.pages[3] as MeasurePageTemplate;
    const reportingRadio = measure.elements[0] as ReportingRadioTemplate;
    const question = measure.elements[1] as TextboxTemplate;

    expect(measure.status).toBe(MeasureStatus.IN_PROGRESS);
    expect(reportingRadio.answer).toBe("no");
    expect(question.answer).toBeFalsy();
  });
});

describe("state/management/reportState: saveReport", () => {
  test("updates store on success", async () => {
    const state = buildState(testReport) as unknown as HcbsReportState;
    const result = await saveReport(state);
    expect(result?.lastSavedTime).toBeTruthy();
  });
});
