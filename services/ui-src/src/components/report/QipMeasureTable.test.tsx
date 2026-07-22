import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QipMeasureTableElement } from "./QipMeasureTable";
import { mockUseStore } from "utils/testing/setupJest";
import { useStore } from "utils/state/useStore";
import {
  ElementType,
  QipMeasureTableTemplate,
  Report,
  ReportType,
} from "types";
import { MemoryRouter, useNavigate } from "react-router-dom";

const mockReport = {
  type: ReportType.QIP,
  pages: [
    {
      id: "measure-targets-not-started",
      navTitle: "Not Started Measure",
      elements: [{ id: "req-element", required: true }],
    },
    {
      id: "measure-targets-in-progress",
      navTitle: "In Progress Measure",
      elements: [
        { id: "req-element", required: true },
        { id: "other-element", answer: "some-value" },
      ],
    },
    {
      id: "measure-targets-complete",
      navTitle: "Complete Measure",
      elements: [],
    },
  ],
  measureTargetMapping: [
    { id: "ltss1", measureName: "Not Started Measure", rates: [] },
    { id: "ltss2", measureName: "In Progress Measure", rates: [] },
    { id: "ltss3", measureName: "Complete Measure", rates: [] },
  ],
} as unknown as Report;

jest.mock("utils/state/useStore");
const mockedUseStore = useStore as jest.MockedFunction<typeof useStore>;
mockedUseStore.mockReturnValue({
  ...mockUseStore,
  report: mockReport,
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn().mockReturnValue({
    reportType: "QIP",
    state: "CO",
    reportId: "123",
  }),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock("./QipMeasureSelectModal", () => ({
  QipMeasureSelectModal: () => <div>Modal</div>,
}));

const mockTemplate: QipMeasureTableTemplate = {
  type: ElementType.QipMeasureTable,
  id: "qip-measure-table",
  caption: "Selected Measures and Targets",
  answer: [
    {
      pageId: "measure-targets-not-started",
      measureName: "Not Started Measure",
    },
    {
      pageId: "measure-targets-in-progress",
      measureName: "In Progress Measure",
    },
    { pageId: "measure-targets-complete", measureName: "Complete Measure" },
  ],
};

const QipMeasureTableComponent = (
  template: QipMeasureTableTemplate = mockTemplate
) => (
  <MemoryRouter>
    <QipMeasureTableElement element={template} updateElement={jest.fn()} />
  </MemoryRouter>
);

describe("Test QipMeasureTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseStore.mockReturnValue({ ...mockUseStore, report: mockReport });
  });

  it("should render table headers and all measure names", () => {
    render(QipMeasureTableComponent());

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Measure details")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Not Started Measure")).toBeInTheDocument();
    expect(screen.getByText("In Progress Measure")).toBeInTheDocument();
    expect(screen.getByText("Complete Measure")).toBeInTheDocument();
  });

  it("should render the Add Measure button", () => {
    render(QipMeasureTableComponent());

    expect(
      screen.getByRole("button", { name: /Add measure/i })
    ).toBeInTheDocument();
  });

  it("should render an Edit link for each measure", () => {
    render(QipMeasureTableComponent());

    expect(screen.getAllByRole("link", { name: /Edit/i })).toHaveLength(3);
  });

  it("should render the empty state when no measures are added", () => {
    render(QipMeasureTableComponent({ ...mockTemplate, answer: [] }));

    expect(
      screen.getByText(
        "Keep track of your measures, once you add a report you can access it here."
      )
    ).toBeInTheDocument();
  });

  it("should display the correct status text for each measure", () => {
    render(QipMeasureTableComponent());

    expect(screen.getByText("Status: Not started")).toBeInTheDocument();
    expect(screen.getByText("Status: In progress")).toBeInTheDocument();
    expect(screen.getByText("Status: Complete")).toBeInTheDocument();
  });

  it("should show error message for not started and in progress measures", () => {
    render(QipMeasureTableComponent());

    expect(
      screen.getAllByText(/Select .Edit. to begin measure./i)
    ).toHaveLength(2);
  });

  it("should not show error message for a complete measure", () => {
    render(
      QipMeasureTableComponent({
        ...mockTemplate,
        answer: [
          {
            pageId: "measure-targets-complete",
            measureName: "Complete Measure",
          },
        ],
      })
    );

    expect(
      screen.queryByText(/Select .Edit. to begin measure./i)
    ).not.toBeInTheDocument();
  });

  it("should navigate to the correct measure page on Edit click", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(QipMeasureTableComponent());

    const editLinks = screen.getAllByRole("link", { name: /Edit/i });
    await userEvent.click(editLinks[0]);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/report/QIP/CO/123/measure-targets-not-started"
    );
  });

  it("should close modal after adding a measure", async () => {
    const mockSetModalOpen = jest.fn();
    const mockSetModalComponent = jest.fn();
    mockedUseStore.mockReturnValue({
      ...mockUseStore,
      report: mockReport,
      setModalOpen: mockSetModalOpen,
      setModalComponent: mockSetModalComponent,
    });

    render(QipMeasureTableComponent());

    const addButton = screen.getByRole("button", { name: /Add measure/i });
    await userEvent.click(addButton);

    expect(mockSetModalComponent).toHaveBeenCalled();
  });
});
