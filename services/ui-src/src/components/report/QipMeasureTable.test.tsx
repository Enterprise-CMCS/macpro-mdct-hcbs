import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QipMeasureTableElement } from "./QipMeasureTable";
import { mockUseStore } from "utils/testing/setupJest";
import { useStore } from "utils/state/useStore";
import * as reportRequestMethods from "utils/api/requestMethods/report";
import { QipDeleteMeasureModal } from "./QipDeleteMeasureModal";
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

jest.mock("./QipDeleteMeasureModal", () => ({
  QipDeleteMeasureModal: jest.fn().mockReturnValue(<div>Delete Modal</div>),
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
  template: QipMeasureTableTemplate = mockTemplate,
  disabled = false
) => (
  <MemoryRouter>
    <QipMeasureTableElement
      element={template}
      updateElement={jest.fn()}
      disabled={disabled}
    />
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

  it("should call setCurrentPageId after adding a measure from the modal", async () => {
    const mockSetModalOpen = jest.fn();
    const mockSetModalComponent = jest.fn();
    const mockSetCurrentPageId = jest.fn();
    const mockUpdateReport = jest.fn();

    jest.spyOn(reportRequestMethods, "addQipTargetPage").mockResolvedValue({
      report: mockReport,
      pageId: "measure-targets-new",
      originalValues: {},
    });

    mockedUseStore.mockReturnValue({
      ...mockUseStore,
      report: mockReport,
      updateReport: mockUpdateReport,
      setCurrentPageId: mockSetCurrentPageId,
      setModalOpen: mockSetModalOpen,
      setModalComponent: mockSetModalComponent,
    });

    render(QipMeasureTableComponent());

    const addButton = screen.getByRole("button", { name: /Add measure/i });
    await userEvent.click(addButton);

    expect(mockSetModalComponent).toHaveBeenCalled();

    const modal = mockSetModalComponent.mock.calls[0][0];
    await modal.props.onSubmit({
      measureId: "ltss4",
      measureName: "New Measure",
      deliveryMethods: ["FFS"],
      rates: ["n"],
    });

    expect(mockSetCurrentPageId).toHaveBeenCalledWith("select-measures");
    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
  });

  it("should render a delete button for each measure", () => {
    render(QipMeasureTableComponent());

    expect(
      screen.getByRole("button", { name: "Delete Not Started Measure" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete In Progress Measure" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete Complete Measure" })
    ).toBeInTheDocument();
  });

  it("should open the delete modal when the delete button is clicked", async () => {
    const mockSetModalOpen = jest.fn();
    const mockSetModalComponent = jest.fn();
    mockedUseStore.mockReturnValue({
      ...mockUseStore,
      report: mockReport,
      setModalOpen: mockSetModalOpen,
      setModalComponent: mockSetModalComponent,
    });

    render(QipMeasureTableComponent());
    await userEvent.click(
      screen.getByRole("button", { name: "Delete Not Started Measure" })
    );

    expect(mockSetModalComponent).toHaveBeenCalled();
    expect(mockSetModalComponent.mock.calls[0][1]).toBe(
      "Are you sure you want to remove this measure?"
    );
  });

  it("should remove the measure and its page on delete confirm", async () => {
    const mockSetModalOpen = jest.fn();
    const mockSetModalComponent = jest.fn();
    const mockUpdateReport = jest.fn();
    const mockUpdateElement = jest.fn();
    const mockedDeleteModal = QipDeleteMeasureModal as jest.Mock;

    mockedUseStore.mockReturnValue({
      ...mockUseStore,
      report: mockReport,
      updateReport: mockUpdateReport,
      setModalOpen: mockSetModalOpen,
      setModalComponent: mockSetModalComponent,
    });

    render(
      <MemoryRouter>
        <QipMeasureTableElement
          element={mockTemplate}
          updateElement={mockUpdateElement}
        />
      </MemoryRouter>
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Delete Not Started Measure" })
    );

    // Invoke the onConfirm callback passed to QipDeleteMeasureModal
    const onConfirm = mockedDeleteModal.mock.calls[0][2];
    onConfirm();

    expect(mockUpdateReport).toHaveBeenCalledWith(
      expect.objectContaining({
        pages: expect.not.arrayContaining([
          expect.objectContaining({ id: "measure-targets-not-started" }),
        ]),
      })
    );
    expect(mockUpdateElement).toHaveBeenCalledWith({
      answer: expect.not.arrayContaining([
        expect.objectContaining({ pageId: "measure-targets-not-started" }),
      ]),
    });
    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
  });

  it("should close the modal without deleting on cancel", async () => {
    const mockSetModalOpen = jest.fn();
    const mockSetModalComponent = jest.fn();
    const mockUpdateElement = jest.fn();
    const mockedDeleteModal = QipDeleteMeasureModal as jest.Mock;

    mockedUseStore.mockReturnValue({
      ...mockUseStore,
      report: mockReport,
      setModalOpen: mockSetModalOpen,
      setModalComponent: mockSetModalComponent,
    });

    render(
      <MemoryRouter>
        <QipMeasureTableElement
          element={mockTemplate}
          updateElement={mockUpdateElement}
        />
      </MemoryRouter>
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Delete Not Started Measure" })
    );

    const onClose = mockedDeleteModal.mock.calls[0][1];
    onClose();

    expect(mockSetModalOpen).toHaveBeenCalledWith(false);
    expect(mockUpdateElement).not.toHaveBeenCalled();
  });

  it("should hide delete buttons when the report is submitted", () => {
    render(QipMeasureTableComponent(mockTemplate, true));

    expect(
      screen.queryByRole("button", { name: "Delete Not Started Measure" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete In Progress Measure" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete Complete Measure" })
    ).not.toBeInTheDocument();
  });

  it("should hide delete buttons for non-end-users (admin)", () => {
    render(QipMeasureTableComponent(mockTemplate, true));

    expect(
      screen.queryByRole("button", { name: "Delete Not Started Measure" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete In Progress Measure" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Delete Complete Measure" })
    ).not.toBeInTheDocument();
  });
});
