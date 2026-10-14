import { beforeEach, describe, expect, it, vi } from "vitest";
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
import { getReport, useStore } from "utils";
import { ReportAutosaveProvider } from "./ReportAutosaveProvider";
import { useNavigate, useParams } from "react-router-dom";

const testReport: Report = {
  type: ReportType.QMS,
  name: "plan id",
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
      navTitle: "General Information",
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
      navTitle: "Required Measure Results",
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

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
}));

vi.mock("../../utils/api/requestMethods/report", () => ({
  getReport: vi.fn(),
}));
vi.mocked(getReport).mockResolvedValue(testReport);

describe("ReportPageWrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({
      reportType: "QMS",
      state: "NJ",
      reportId: "QMSNJ123",
    });
    useStore.setState({
      report: testReport,
      pageMap: new Map([
        ["root", 0],
        ["general-info", 1],
        ["req-measure-result", 2],
      ]),
      currentPageId: "general-info",
      parentPage: {
        index: 0,
        parent: "root",
        childPageIds: ["general-info", "req-measure-result"],
      },
      saveReport: vi.fn(),
    });
  });

  it("should not render if missing params", async () => {
    vi.mocked(useParams).mockReturnValue({
      reportType: undefined,
      state: undefined,
      reportId: undefined,
    });
    render(<ReportPageWrapper />);
    expect(getReport).not.toHaveBeenCalled();
    expect(screen.getByText("bad params")).toBeTruthy(); // To be updated with real error page
  });

  it("should render Loading if report not loaded", async () => {
    vi.mocked(getReport).mockResolvedValueOnce(undefined as any);

    render(<ReportPageWrapper />);
    await waitFor(() => expect(getReport).toHaveBeenCalled());

    expect(screen.getByText("Loading...")).toBeTruthy();
  });

  it("should render if report exists", async () => {
    await act(async () => {
      render(<ReportPageWrapper />);
    });
    await waitFor(() => expect(getReport).toHaveBeenCalled());

    await waitFor(() => {
      expect(screen.queryAllByText("General Information")).toBeDefined();
    });
    expect(screen.getByText("Continue")).toBeTruthy();
    expect(screen.queryAllByText("General Information")[0]).toBeTruthy();
  });

  it("should navigate on Continue button click", async () => {
    await act(async () => {
      render(<ReportPageWrapper />);
    });

    const continueBtn = screen.getByRole("button", { name: "Continue" });
    await userEvent.click(continueBtn);
    expect(useNavigate()).toHaveBeenCalledWith(
      "/report/QMS/NJ/QMSNJ123/req-measure-result"
    );
  });

  it("should autosave when a text field has changed", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    await act(async () => {
      render(
        <ReportAutosaveProvider>
          <ReportPageWrapper />
        </ReportAutosaveProvider>
      );
    });

    const textbox = screen.getByLabelText("Contact title");
    await act(async () => {
      fireEvent.change(textbox, { target: { value: "2027" } });
    });
    expect(textbox).toHaveValue("2027");

    vi.runAllTimers();
    await waitFor(() =>
      expect(useStore.getState().saveReport).toHaveBeenCalled()
    );
    vi.useRealTimers();
  });

  describe("Page validation", () => {
    beforeEach(() => {
      vi.mocked(useParams).mockReturnValue({
        reportType: "QMS",
        state: "NJ",
        reportId: "QMSNJ123",
      });
    });

    it.skip("should display error when text field is blurred with no input", async () => {
      render(<ReportPageWrapper />);
      await waitFor(() => expect(getReport).toHaveBeenCalled());

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
});
