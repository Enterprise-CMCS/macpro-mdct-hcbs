import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MeasureTableElement } from "./MeasureTable";
import { mockUseStore } from "utils/testing/setupJest";
import { useStore } from "utils/state/useStore";
import {
  ElementType,
  MeasurePageTemplate,
  MeasureTableTemplate,
  PageType,
  Report,
  ReportStatus,
} from "types";
import { MemoryRouter, useNavigate } from "react-router-dom";

const mockReport = {
  status: ReportStatus.IN_PROGRESS,
  pages: [
    {
      type: PageType.Measure,
      id: "mock-measure-1",
      title: "Mock Measure Req",
      cmit: 42,
      substitutable: "mock-measure-3",
      required: true,
    } as MeasurePageTemplate,
    {
      type: PageType.Measure,
      id: "mock-measure-2",
      title: "Mock Measure Strat",
      cmit: 43,
      required: true,
      stratified: true,
    } as MeasurePageTemplate,
    {
      type: PageType.Measure,
      id: "mock-measure-3",
      title: "Mock Measure Opt",
      cmit: 44,
      substitutable: "mock-measure-1",
      required: false,
    } as MeasurePageTemplate,
  ],
} as Report;

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockUseStore,
  report: mockReport,
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn().mockReturnValue({
    reportType: "QMS",
    state: "CO",
    reportId: "123",
  }),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
}));
const mockedNavigate = useNavigate() as jest.Mock;

const mockTemplate: MeasureTableTemplate = {
  type: ElementType.MeasureTable,
  id: "mock-table-id",
  measureDisplay: "required",
};

jest.mock("./MeasureReplacementModal", () => ({
  MeasureReplacementModal: (
    measure: MeasurePageTemplate,
    _onClose: Function,
    onSubmit: Function
  ) => {
    onSubmit(measure);
  },
}));

const MeasureTableComponent = (
  measureDisplay: MeasureTableTemplate["measureDisplay"]
) => {
  const template = { ...mockTemplate, measureDisplay };
  return (
    <MemoryRouter>
      <MeasureTableElement element={template} formkey={""} />
    </MemoryRouter>
  );
};

describe("Test MeasureTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display required measures when in required mode", () => {
    render(MeasureTableComponent("required"));

    expect(screen.getByText("Mock Measure Req")).toBeInTheDocument();
    // Note that our mock Stratified measure is required, so it will show here.
    expect(screen.getByText("Mock Measure Strat")).toBeInTheDocument();
    expect(screen.queryByText("Mock Measure Opt")).not.toBeInTheDocument();
  });

  it("should display stratified measures when in stratified mode", () => {
    render(MeasureTableComponent("stratified"));

    expect(screen.queryByText("Mock Measure Req")).not.toBeInTheDocument();
    expect(screen.getByText("Mock Measure Strat")).toBeInTheDocument();
    expect(screen.queryByText("Mock Measure Opt")).not.toBeInTheDocument();
  });

  it("should display optional measures when in optional mode", () => {
    render(MeasureTableComponent("optional"));

    expect(screen.queryByText("Mock Measure Req")).not.toBeInTheDocument();
    expect(screen.queryByText("Mock Measure Strat")).not.toBeInTheDocument();
    expect(screen.getByText("Mock Measure Opt")).toBeInTheDocument();

    // Also, the substitute button should not be visible for non-required measures
    expect(screen.queryByText("Substitute measure")).not.toBeInTheDocument();
  });

  it("should perform substitution when the button is clicked", async () => {
    const mockSubstitute = jest.fn();
    const requiredMeasure = mockReport.pages.find((p: any) => p.required);
    mockedUseStore.mockReturnValue({
      ...mockUseStore,
      report: mockReport,
      setSubstitute: mockSubstitute,
    });

    render(MeasureTableComponent("required"));

    const substituteButton = screen.getByText("Substitute measure");
    await userEvent.click(substituteButton);
    expect(mockSubstitute).toHaveBeenCalledWith(mockReport, requiredMeasure);
  });

  it("should not show the substitute button for submitted reports", () => {
    mockedUseStore.mockReturnValueOnce({
      ...mockUseStore,
      report: {
        ...mockReport,
        status: ReportStatus.SUBMITTED,
      },
    });
    render(MeasureTableComponent("required"));
    const substituteButton = screen.queryByText("Substitute measure");
    expect(substituteButton).not.toBeInTheDocument();
  });

  it("should navigate to the measure when the edit button is clicked", async () => {
    render(MeasureTableComponent("required"));
    const editButton = screen.getAllByText("Edit")[0];
    await userEvent.click(editButton);
    expect(mockedNavigate).toHaveBeenCalledWith(
      "/report/QMS/CO/123/mock-measure-1"
    );
  });
});
