import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QipMeasureTableElement } from "./QipMeasureTable";
import { useDeleteConfirmModal } from "./useDeleteConfirmModal";
import { useStore } from "utils/state/useStore";
import {
  ElementType,
  MeasureTargetMapping,
  QipMeasureTableTemplate,
  Report,
  ReportType,
} from "types";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { ReportModal } from "./ReportModal";
import { addQipTargetPage } from "utils";

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
    {
      measureName: "Not Started Measure",
      measureId: "ltss1",
      includedInQms: false,
      deliveryMethods: { FFS: {} },
      rates: [{ label: "Rate One", id: "r1" }],
    },
    {
      measureName: "In Progress Measure",
      measureId: "ltss2",
      includedInQms: false,
      deliveryMethods: { FFS: {} },
      rates: [{ label: "Rate One", id: "r1" }],
    },
    {
      measureName: "Complete Measure",
      measureId: "ltss3",
      includedInQms: false,
      deliveryMethods: { FFS: {} },
      rates: [{ label: "Rate One", id: "r1" }],
    },
  ] as MeasureTargetMapping,
} as Report;

vi.mock("react-router-dom", async (importOriginal) => ({
  ...(await importOriginal()),
  useParams: vi.fn().mockReturnValue({
    reportType: "QIP",
    state: "CO",
    reportId: "123",
  }),
  useNavigate: vi.fn().mockReturnValue(vi.fn()),
}));

vi.mock("./useDeleteConfirmModal", () => ({
  useDeleteConfirmModal: vi.fn(),
}));

const openDeleteModal = vi.fn();
vi.mocked(useDeleteConfirmModal).mockReturnValue({
  addButtonRef: { current: null },
  getDeleteButtonRef: vi.fn(),
  openDeleteModal: openDeleteModal,
});

vi.mock("utils", async (importOriginal) => ({
  ...(await importOriginal()),
  getReportsForState: vi.fn().mockResolvedValue([]),
  addQipTargetPage: vi.fn().mockResolvedValue({ report: { pages: [] } }),
}));
/*
vi.mock("@cmsgov/design-system", () => ({
  Dropdown: ({
    label,
    name,
    value,
    options,
    disabled,
    errorMessage,
    onChange,
  }: Omit<React.ComponentProps<typeof Dropdown>, "options"> & {
    options: { label: string; value: string }[];
  }) => (
    <>
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorMessage ? <div>{errorMessage}</div> : null}
    </>
  ),
  ChoiceList: ({
    label,
    name,
    choices,
    errorMessage,
    onChange,
  }: Omit<React.ComponentProps<typeof ChoiceList>, "choices"> & {
    choices: { label: string; value: string; checked: boolean }[];
  }) => (
    <>
      <fieldset>
        <legend>{label}</legend>
        {choices.map((choice) => (
          <div key={choice.value}>
            <input
              type="checkbox"
              id={`${name}-${choice.value}`}
              name={name}
              value={choice.value}
              checked={choice.checked}
              onChange={onChange}
            />
            <label htmlFor={`${name}-${choice.value}`}>{choice.label}</label>
          </div>
        ))}
      </fieldset>
      {errorMessage ? <div>{errorMessage}</div> : null}
    </>
  ),
}));
*/
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
    <ReportModal />
    <QipMeasureTableElement
      element={template}
      updateElement={vi.fn()}
      disabled={disabled}
    />
  </MemoryRouter>
);

describe("QipMeasureTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useStore.setState({
      report: mockReport,
      updateReport: vi.fn(),
      saveReport: vi.fn(),
    });
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
        "No measures found in this Quality Improvement Plan. Once you add a measure you can access it here."
      )
    ).toBeInTheDocument();
  });

  it("should display the correct status text for each measure", () => {
    render(QipMeasureTableComponent());

    expect(screen.getByText("Status: Not started")).toBeInTheDocument();
    expect(screen.getByText("Status: In progress")).toBeInTheDocument();
    expect(screen.getByText("Status: Complete")).toBeInTheDocument();
  });

  it("should show error message for not started", () => {
    render(QipMeasureTableComponent());

    expect(
      screen.getAllByText(/Select .Edit. to begin measure./i)
    ).toHaveLength(1);
  });

  it("should not show error message for an in progress measure", () => {
    render(
      QipMeasureTableComponent({
        ...mockTemplate,
        answer: [
          {
            pageId: "measure-targets-in-progress",
            measureName: "In Progress Measure",
          },
        ],
      })
    );

    expect(
      screen.queryByText(/Select .Edit. to begin measure./i)
    ).not.toBeInTheDocument();
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
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(QipMeasureTableComponent());

    const editLinks = screen.getAllByRole("link", { name: /Edit/i });
    await userEvent.click(editLinks[0]);

    expect(mockNavigate).toHaveBeenCalledWith(
      "/report/QIP/CO/123/measure-targets-not-started"
    );
  });

  it("should call setCurrentPageId after adding a measure from the modal", async () => {
    useStore.setState({ setCurrentPageId: vi.fn() });

    render(QipMeasureTableComponent());

    const addButton = screen.getByRole("button", { name: /Add measure/i });
    await userEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/Select a measure/)).toBeVisible();
    });
    // The CMSDS Dropdown does not have the "combobox" role,
    // and it exposes its currently-selected option as a button,
    // which makes this test look weird.
    // We're selecting the "Not Started Measure" option from the dropdown.
    await userEvent.click(
      screen.getByRole("button", { name: /Select measure/ })
    );
    await userEvent.click(
      screen.getByRole("option", { name: /Not Started Measure/ })
    );

    await userEvent.click(screen.getByRole("checkbox", { name: /FFS/ }));
    await userEvent.click(screen.getByRole("checkbox", { name: /Rate One/ }));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(addQipTargetPage).toHaveBeenCalledWith(
      useStore.getState().report,
      expect.objectContaining({
        measureId: "ltss1",
        deliveryMethods: ["FFS"],
        rates: ["r1"],
      })
    );
    await waitFor(() =>
      expect(useStore.getState().setCurrentPageId).toHaveBeenCalledWith(
        "select-measures"
      )
    );
    expect(useStore.getState().modalOpen).toBe(false);
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

  it("should remove the measure and its page on delete confirm", async () => {
    const updateElement = vi.fn();
    useStore.setState({
      report: mockReport,
      updateReport: vi.fn(),
    });

    render(
      <MemoryRouter>
        <QipMeasureTableElement
          element={mockTemplate}
          updateElement={updateElement}
        />
      </MemoryRouter>
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Delete Not Started Measure" })
    );
    expect(openDeleteModal).toHaveBeenCalled();

    const deleteConfirmCallback = vi.mocked(useDeleteConfirmModal).mock
      .calls[0][0].onConfirm;
    await deleteConfirmCallback(
      mockTemplate.answer!.slice(1),
      mockTemplate.answer![0].pageId
    );

    expect(useStore.getState().updateReport).toHaveBeenCalledWith(
      expect.objectContaining({
        pages: expect.not.arrayContaining([
          expect.objectContaining({ id: "measure-targets-not-started" }),
        ]),
      })
    );
    expect(updateElement).toHaveBeenCalledWith({
      answer: expect.not.arrayContaining([
        expect.objectContaining({ pageId: "measure-targets-not-started" }),
      ]),
    });
  });

  it("should close the modal without deleting on cancel", async () => {
    const mockUpdateElement = vi.fn();

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
    expect(openDeleteModal).toHaveBeenCalledWith("measure-targets-not-started");
    expect(mockUpdateElement).not.toHaveBeenCalled();
  });

  it("should hide delete buttons when disabled is true", () => {
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
