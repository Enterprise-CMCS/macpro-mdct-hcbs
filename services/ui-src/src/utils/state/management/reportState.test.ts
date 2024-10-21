import { HcbsReportState } from "types";
import {
  ElementType,
  MeasureTemplateName,
  PageType,
  Report,
  ReportType,
  TextboxTemplate,
} from "types/report";
import { buildState, mergeAnswers, setPage } from "./reportState";

jest.mock("../../api/requestMethods/report", () => ({
  putReport: jest.fn(),
}));
const testReport: Report = {
  type: ReportType.QM,
  title: "plan id",
  state: "NJ",
  id: "NJQM123",
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
          text: "General Information",
        },
        {
          type: ElementType.Textbox,
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
          text: "Required Measure Results",
        },
      ],
    },
  ],
  measureLookup: { defaultMeasures: [], optionGroups: {} },
  measureTemplates: {
    [MeasureTemplateName.StandardMeasure]: {
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
      ],
    },
  },
};

describe("state/management/reportState: buildState", () => {
  test("initializes relevant parts of the state", () => {
    const result = buildState(testReport);
    expect(result.pageMap!.size).toEqual(3);
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
    expect(result.pageId).toEqual("req-measure-result");
  });
});

describe("state/management/reportState: mergeAnswers", () => {
  test("Adds answers to a question", () => {
    // Jest is garbage
    global.structuredClone = (val) => {
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
