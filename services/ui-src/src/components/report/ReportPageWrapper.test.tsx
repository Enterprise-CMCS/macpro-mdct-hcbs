import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  ElementType,
  PageType,
  Report,
  ReportStatus,
  ReportType,
} from "types/report";
import { ReportPageWrapper } from "./ReportPageWrapper";

const testReport: Report = {
  type: ReportType.XYZ,
  name: "plan id",
  state: "NJ",
  id: "NJQMS123",
  year: 2026,
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
          type: ElementType.Textbox,
          id: "mock-textbox",
          label: "Contact title",
          required: true,
          helperText:
            "Enter person's title or a position title for CMS to contact with questions about this request.",
        },
        {
          type: ElementType.Textbox,
          id: "another-textbox",
          required: true,
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
};

const mockUseParams = jest.fn();
const mockNavigate = jest.fn();
const mockSaveReport = jest.fn();

jest.mock("react-router-dom", () => ({
  useParams: () => mockUseParams(),
  useNavigate: () => mockNavigate,
}));

const mockGetReport = jest.fn().mockResolvedValue(testReport);
jest.mock("../../utils/api/requestMethods/report", () => ({
  getReport: () => mockGetReport(),
}));

jest.mock("utils/state/useStore", () => ({
  ...jest.requireActual("utils/state/useStore"),
  saveReport: () => mockSaveReport,
}));

describe("ReportPageWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({
      reportType: "XYZ",
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
      "/report/XYZ/NJ/QMSNJ123/req-measure-result"
    );
  });

  test("run autosave when a text field has changed", async () => {
    jest.useFakeTimers();

    global.structuredClone = (val: unknown) => {
      return JSON.parse(JSON.stringify(val));
    };

    await act(async () => {
      render(<ReportPageWrapper />);
    });

    const textbox = screen.getByLabelText("Contact title");
    await act(async () => {
      fireEvent.change(textbox, { target: { value: "2027" } });
    });
    expect(textbox).toHaveValue("2027");

    jest.runAllTimers();
    await waitFor(() => expect(mockSaveReport).toHaveBeenCalled);
  });
});

describe("Page validation", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({
      reportType: "XYZ",
      state: "NJ",
      reportId: "QMSNJ123",
    });
  });

  test.skip("form should display error when text field is blurred with no input", async () => {
    global.structuredClone = (val: unknown) => {
      return JSON.parse(JSON.stringify(val));
    };

    render(<ReportPageWrapper />);
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
