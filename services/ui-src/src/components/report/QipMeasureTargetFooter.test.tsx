import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  ElementType,
  HcbsUser,
  QipMeasureTargetFooterTemplate,
  Report,
  ReportStatus,
} from "types";
import { QipMeasureTargetFooterElement } from "./QipMeasureTargetFooter";
import { ReportAutosaveContext } from "./ReportAutosaveProvider";
// import userEventTl from "@testing-library/user-event";
import userEvent from "@testing-library/user-event";
import { useStore } from "utils/state/useStore";
import { useNavigate } from "react-router-dom";

// const userEvent = userEventTl.setup({ advanceTimers: vi.advanceTimersByTime });

const mockAutosave = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
  useParams: vi.fn(() => ({
    reportType: "QIP",
    state: "CO",
    reportId: "mock-id",
  })),
}));

const mockedQipMeasureTargetFooter: QipMeasureTargetFooterTemplate = {
  id: "mock-footer-id",
  type: ElementType.QipMeasureTargetFooter,
  returnTo: "select-measures",
};

const renderWithAutosave = (element: QipMeasureTargetFooterTemplate) =>
  render(
    <ReportAutosaveContext.Provider value={{ autosave: mockAutosave }}>
      <QipMeasureTargetFooterElement element={element} />
    </ReportAutosaveContext.Provider>
  );

describe("QipMeasureTargetFooter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    useStore.setState({
      user: { userIsEndUser: true } as HcbsUser,
      report: {
        pages: [{ id: "page-1" }],
        status: ReportStatus.IN_PROGRESS,
      } as Report,
      pageMap: new Map([["page-1", 0]]),
      currentPageId: "page-1",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render the button, call autosave, and navigate", async () => {
    renderWithAutosave(mockedQipMeasureTargetFooter);

    expect(
      screen.queryByRole("button", { name: "Previous" })
    ).not.toBeInTheDocument();

    const actionBtn = screen.getByRole("button", { name: "Save & return" });
    await userEvent.click(actionBtn);
    vi.advanceTimersByTime(10);

    expect(mockAutosave).toHaveBeenCalledTimes(1);
    expect(useNavigate()).toHaveBeenCalledWith(
      "/report/QIP/CO/mock-id/select-measures"
    );
  });

  it("should skip autosave and still navigate when report is read-only (submitted)", async () => {
    useStore.setState({
      report: {
        ...useStore.getState().report!,
        status: ReportStatus.SUBMITTED,
      },
    });

    renderWithAutosave(mockedQipMeasureTargetFooter);

    const actionBtn = screen.getByRole("button", { name: "Save & return" });
    await userEvent.click(actionBtn);
    vi.advanceTimersByTime(10);

    expect(mockAutosave).not.toHaveBeenCalled();
    expect(useNavigate()).toHaveBeenCalledWith(
      "/report/QIP/CO/mock-id/select-measures"
    );
  });
});
