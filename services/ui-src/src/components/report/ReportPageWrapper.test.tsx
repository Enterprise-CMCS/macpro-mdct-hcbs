import {
  screen,
  render,
  waitFor,
  act,
  fireEvent,
} from "@testing-library/react";
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
import userEvent from "@testing-library/user-event";

const testReport: Report = {
  type: ReportType.QMS,
  title: "plan id",
  state: "NJ",
  id: "NJQMS123",
  year: 2026,
  options: {},
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
        {
          type: ElementType.Textbox,
          id: "another-textbox",
          label: "Another textbox",
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
          type: ElementType.MeasureResultsNavigationTable,
          measureDisplay: "quality",
        },
      ],
    },
    [MeasureTemplateName["FFS-1"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
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
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["FFS-2"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
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
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["MLTSS"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["MLTSS-DM"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["FFS-3"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
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
    [MeasureTemplateName["FASI-1"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["FFS-FASI-1"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["MLTSS-FASI-1"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["FASI-2"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["FFS-FASI-2"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["MLTSS-FASI-2"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["HCBS-10"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["LTSS-4"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["LTSS-5"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["LTSS-5-PT1"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["LTSS-5-PT2"]]: {
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
    [MeasureTemplateName["FFS-6"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["MLTSS-6"]]: {
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
    [MeasureTemplateName["FFS-7"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["MLTSS-7"]]: {
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
    [MeasureTemplateName["FFS-8"]]: {
      id: "",
      title: "",
      cmitId: "",
      status: MeasureStatus.IN_PROGRESS,
      type: PageType.Measure,
      elements: [],
    },
    [MeasureTemplateName["MLTSS-8"]]: {
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
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useParams: () => mockUseParams(),
  useNavigate: () => mockNavigate,
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
    expect(screen.getByText("Loading...")).toBeTruthy();
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
  test("button should be clickable", async () => {
    await act(async () => {
      render(<ReportPageWrapper />);
    });

    const continueBtn = screen.getByRole("button", { name: "Continue" });
    await userEvent.click(continueBtn);
    expect(mockNavigate).toHaveBeenCalledWith(
      "/report/QMS/NJ/QMSNJ123/req-measure-result"
    );
  });
});

describe("Page validation", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({
      reportType: "QMS",
      state: "NJ",
      reportId: "QMSNJ123",
    });
  });
  test.skip("form should display error when text field is blurred with no input", async () => {
    global.structuredClone = (val: unknown) => {
      return JSON.parse(JSON.stringify(val));
    };

    await act(async () => {
      render(<ReportPageWrapper />);
    });
    await waitFor(() => expect(mockGetReport).toHaveBeenCalled);

    const contactTitleInput = screen.getByLabelText("Another textbox");

    // blur the textbox without entering anything
    await act(async () => {
      fireEvent.blur(contactTitleInput);
    });

    // validation error will appear since textbox is empty
    const responseIsRequiredErrorMessage = screen.getAllByText(
      "A response is required",
      { exact: false }
    );
    expect(responseIsRequiredErrorMessage[0]).toBeVisible();
    expect(responseIsRequiredErrorMessage.length).toBe(2);
  });
});
