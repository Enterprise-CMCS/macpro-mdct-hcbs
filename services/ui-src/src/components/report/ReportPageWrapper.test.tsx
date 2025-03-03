import { screen, render, waitFor, act } from "@testing-library/react";
import {
  ElementType,
  MeasurePageTemplate,
  MeasureStatus,
  MeasureTemplateName,
  PageType,
  Report,
  ReportStatus,
  ReportType,
} from "types/report";
import { ReportPageWrapper } from "./ReportPageWrapper";

const testReport: Report = {
  type: ReportType.QMS,
  title: "plan id",
  state: "NJ",
  id: "NJQMS123",
  year: 2026,
  options: {},
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
  ],
  measureLookup: { defaultMeasures: [], optionGroups: {} },
  measureTemplates: {
    [MeasureTemplateName["LTSS-1"]]: {
      id: "req-measure-report",
      title: "Example Measure",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      sidebar: false,
      elements: [
        {
          type: ElementType.ButtonLink,
          id: "",
          label: "Return to Required Measures Results Dashboard",
          to: "req-measure-result",
        },
        {
          type: ElementType.QualityMeasureTable,
          measureDisplay: "quality",
        },
      ],
    },
    [MeasureTemplateName["LTSS-2"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["LTSS-6"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["LTSS-7"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["LTSS-8"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["FFS-1"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["POM-1"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
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
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["POM-4"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["POM-5"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["POM-6"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["POM-7"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
  } as Record<MeasureTemplateName, MeasurePageTemplate>,
};

const mockUseParams = jest.fn();
jest.mock("react-router-dom", () => ({
  useParams: () => mockUseParams(),
  useNavigate: jest.fn(),
}));

const mockGetReport = jest.fn().mockResolvedValue(testReport);
jest.mock("../../utils/api/requestMethods/report", () => ({
  getReport: () => mockGetReport(),
}));
describe("ReportPageWrapper", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({
      reportType: "QMS",
      state: "NJ",
      reportId: "QMSNJ123",
    });
  });
  test("should not render if missing params", async () => {
    mockUseParams.mockReturnValue({
      reportType: undefined,
      state: undefined,
      reportId: undefined,
    });
    render(<ReportPageWrapper />);
    await waitFor(() => expect(mockGetReport).toHaveBeenCalled);
    expect(screen.getByText("bad params")).toBeTruthy(); // To be updated with real error page
  });
  test("should render Loading if report not loaded", async () => {
    mockGetReport.mockResolvedValueOnce(undefined);
    render(<ReportPageWrapper />);
    await waitFor(() => expect(mockGetReport).toHaveBeenCalled);
    expect(screen.getByText("Loading")).toBeTruthy(); // To be updated with real loading page
  });
  test("should render if report exists", async () => {
    await act(async () => {
      render(<ReportPageWrapper />);
    });
    await waitFor(() => expect(mockGetReport).toHaveBeenCalled);

    await waitFor(() => {
      expect(screen.queryAllByText("General Information")).toBeDefined();
    });
    expect(screen.getByText("Continue")).toBeTruthy();
    expect(screen.queryAllByText("General Information")[0]).toBeTruthy();
  });
});
