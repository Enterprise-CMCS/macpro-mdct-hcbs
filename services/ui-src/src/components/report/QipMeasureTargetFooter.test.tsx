import { render, screen } from "@testing-library/react";
import {
  ElementType,
  QipMeasureTargetFooterTemplate,
  ReportStatus,
} from "types";
import { QipMeasureTargetFooterElement } from "./QipMeasureTargetFooter";
import { ReportAutosaveContext } from "./ReportAutosaveProvider";
import userEventTl from "@testing-library/user-event";
import { mockUseStore } from "utils/testing/setupJest";

const mockUseNavigate = jest.fn();
const mockAutosave = jest.fn();

jest.mock("utils/state/useStore", () => ({
  useStore: jest
    .fn()
    .mockImplementation(
      (selector?: (state: typeof mockUseStore) => unknown) => {
        if (selector) {
          return selector(mockUseStore);
        }
        return mockUseStore;
      }
    ),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockUseNavigate,
  useParams: jest.fn(() => ({
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

describe("QipMeasureTargetFooter test(s)", () => {
  const userEvent = userEventTl.setup({ delay: null });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should render the button, call autosave, and navigate", async () => {
    renderWithAutosave(mockedQipMeasureTargetFooter);

    expect(
      screen.queryByRole("button", { name: "Previous" })
    ).not.toBeInTheDocument();

    const actionBtn = screen.getByRole("button", { name: "Save & return" });
    await userEvent.click(actionBtn);
    jest.advanceTimersByTime(10);

    expect(mockAutosave).toHaveBeenCalledTimes(1);
    expect(mockUseNavigate).toHaveBeenCalledWith(
      "/report/QIP/CO/mock-id/select-measures"
    );
  });

  it("should skip autosave and still navigate when report is read-only (submitted)", async () => {
    const readOnlyStore = {
      ...mockUseStore,
      report: { ...mockUseStore.report!, status: ReportStatus.SUBMITTED },
    };
    const { useStore } = jest.requireMock("utils/state/useStore");
    useStore.mockImplementation(
      (selector?: (state: typeof readOnlyStore) => unknown) => {
        if (selector) return selector(readOnlyStore);
        return readOnlyStore;
      }
    );

    renderWithAutosave(mockedQipMeasureTargetFooter);

    const actionBtn = screen.getByRole("button", { name: "Save & return" });
    await userEvent.click(actionBtn);
    jest.advanceTimersByTime(10);

    expect(mockAutosave).not.toHaveBeenCalled();
    expect(mockUseNavigate).toHaveBeenCalledWith(
      "/report/QIP/CO/mock-id/select-measures"
    );
  });
});
