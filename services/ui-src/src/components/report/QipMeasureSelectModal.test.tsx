import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import assert from "node:assert";
import { Modal, ModalContent } from "@chakra-ui/react";
import { QipMeasureSelectModal } from "./QipMeasureSelectModal";
import {
  MeasureTargetMapping,
  ReportStatus,
  ReportType,
  type LiteReport,
} from "types";

type DropdownProps = {
  label: React.ReactNode;
  name: string;
  value: string;
  options: { label: string; value: string }[];
  disabled?: boolean;
  errorMessage?: string;
  onChange: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
};

type ChoiceListProps = {
  label: string;
  name: string;
  choices: { label: string; value: string; checked?: boolean }[];
  errorMessage?: string;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
};

jest.mock("@cmsgov/design-system", () => ({
  Dropdown: ({
    label,
    name,
    value,
    options,
    disabled,
    errorMessage,
    onChange,
  }: DropdownProps) => (
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
  }: ChoiceListProps) => (
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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn().mockReturnValue({ state: "CO" }),
}));

const mockGetReportsForState = jest.fn().mockResolvedValue([]);
jest.mock("utils", () => ({
  getReportsForState: (...args: unknown[]) => mockGetReportsForState(...args),
}));

const defaultMeasureMapping: MeasureTargetMapping = [
  {
    measureId: "m1",
    measureName: "Measure 1",
    includedInQms: false,
    deliveryMethods: { MLTSS: {}, FFS: {} },
    rates: [
      { id: "n", label: "Numerator" },
      { id: "d", label: "Denominator" },
    ],
  },
] as unknown as MeasureTargetMapping;

const renderInModal = ({
  measureTargetMapping = defaultMeasureMapping,
  onSubmit = jest.fn().mockResolvedValue(undefined),
}: {
  measureTargetMapping?: MeasureTargetMapping;
  onSubmit?: jest.Mock;
}) => {
  render(
    <Modal isOpen={true} onClose={jest.fn()}>
      <ModalContent>
        <QipMeasureSelectModal
          measureTargetMapping={measureTargetMapping}
          onClose={jest.fn()}
          onSubmit={onSubmit}
        />
      </ModalContent>
    </Modal>
  );

  return { onSubmit };
};

const waitForInitialLoad = async () => {
  await waitFor(() => {
    expect(mockGetReportsForState).toHaveBeenCalledWith(ReportType.QMS, "CO");
  });
};

describe("QipMeasureSelectModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetReportsForState.mockResolvedValue([]);
  });

  it("should render default modal content", async () => {
    renderInModal({});
    await waitForInitialLoad();

    expect(
      screen.getByText(/Select a measure from the dropdown to add/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("should show measure validation error when Save is clicked without selecting a measure", async () => {
    renderInModal({});
    await waitForInitialLoad();

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByText("Please select a measure.")).toBeInTheDocument();
  });

  it("should show delivery method and rate validation errors when a measure is selected but required checkboxes are missing", async () => {
    renderInModal({});
    await waitForInitialLoad();

    const measureDropdown = screen.getByLabelText("Measure report");
    assert.ok(measureDropdown instanceof HTMLSelectElement);
    await userEvent.selectOptions(measureDropdown, "m1");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(
      screen.getByText("Please select one or more delivery methods.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please select one or more rates.")
    ).toBeInTheDocument();
  });

  it("should show 'No reports available for copy-over' when no submitted QMS reports exist", async () => {
    const qmsMeasureMapping: MeasureTargetMapping = [
      {
        ...defaultMeasureMapping[0],
        includedInQms: true,
      },
    ] as MeasureTargetMapping;

    mockGetReportsForState.mockResolvedValue([]);

    renderInModal({ measureTargetMapping: qmsMeasureMapping });

    await waitForInitialLoad();

    const measureDropdown = screen.getByLabelText("Measure report");
    assert.ok(measureDropdown instanceof HTMLSelectElement);
    await userEvent.selectOptions(measureDropdown, "m1");

    const qmsDropdown = await screen.findByLabelText(
      /submitted Quality Measure Set report/i
    );
    assert.ok(qmsDropdown instanceof HTMLSelectElement);

    expect(
      screen.getByText("No reports available for copy-over")
    ).toBeInTheDocument();
  });

  it("should render QMS report dropdown with only submitted reports", async () => {
    const qmsMeasureMapping: MeasureTargetMapping = [
      {
        ...defaultMeasureMapping[0],
        includedInQms: true,
      },
    ] as MeasureTargetMapping;

    const reports = [
      {
        id: "submitted-1",
        name: "Submitted Report",
        status: ReportStatus.SUBMITTED,
      },
      {
        id: "in-progress-1",
        name: "In Progress Report",
        status: ReportStatus.IN_PROGRESS,
      },
    ] as LiteReport[];

    mockGetReportsForState.mockResolvedValue(reports);

    renderInModal({ measureTargetMapping: qmsMeasureMapping });

    await waitForInitialLoad();

    const measureDropdown = screen.getByLabelText("Measure report");
    assert.ok(measureDropdown instanceof HTMLSelectElement);
    await userEvent.selectOptions(measureDropdown, "m1");

    const qmsDropdown = await screen.findByLabelText(
      /submitted Quality Measure Set report/i
    );
    assert.ok(qmsDropdown instanceof HTMLSelectElement);

    expect(screen.getByText("Submitted Report")).toBeInTheDocument();
    expect(screen.queryByText("In Progress Report")).not.toBeInTheDocument();
  });

  it("should show a loading spinner while QMS reports are loading", async () => {
    let resolveReports: (value: LiteReport[]) => void;
    const loadingReports = new Promise<LiteReport[]>((resolve) => {
      resolveReports = resolve;
    });
    mockGetReportsForState.mockReturnValueOnce(loadingReports);

    const qmsMeasureMapping: MeasureTargetMapping = [
      {
        ...defaultMeasureMapping[0],
        includedInQms: true,
      },
    ] as MeasureTargetMapping;

    renderInModal({ measureTargetMapping: qmsMeasureMapping });

    const measureDropdown = screen.getByLabelText("Measure report");
    assert.ok(measureDropdown instanceof HTMLSelectElement);
    await userEvent.selectOptions(measureDropdown, "m1");

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    resolveReports!([
      {
        id: "submitted-1",
        name: "Submitted Report",
        status: ReportStatus.SUBMITTED,
      },
    ] as LiteReport[]);

    await waitFor(() => {
      expect(
        screen.getByLabelText(/submitted Quality Measure Set report/i)
      ).toBeInTheDocument();
    });
  });

  it("should submit sorted delivery methods and rates", async () => {
    const { onSubmit } = renderInModal({});
    await waitForInitialLoad();

    const measureDropdown = screen.getByLabelText("Measure report");
    assert.ok(measureDropdown instanceof HTMLSelectElement);
    await userEvent.selectOptions(measureDropdown, "m1");

    await userEvent.click(screen.getByLabelText("Delivery Method: MLTSS"));
    await userEvent.click(screen.getByLabelText("Delivery Method: FFS"));
    await userEvent.click(screen.getByLabelText("Denominator"));
    await userEvent.click(screen.getByLabelText("Numerator"));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      measureId: "m1",
      measureName: "Measure 1",
      qmsReportId: undefined,
      deliveryMethods: ["FFS", "MLTSS"],
      rates: ["n", "d"],
    });
  });

  it("should display a submit error message when add measure request fails", async () => {
    const { onSubmit } = renderInModal({
      onSubmit: jest.fn().mockRejectedValue(new Error("submit failed")),
    });
    await waitForInitialLoad();

    const measureDropdown = screen.getByLabelText("Measure report");
    assert.ok(measureDropdown instanceof HTMLSelectElement);
    await userEvent.selectOptions(measureDropdown, "m1");

    await userEvent.click(screen.getByLabelText("Delivery Method: FFS"));
    await userEvent.click(screen.getByLabelText("Numerator"));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });

  it("should clear selected QMS report when switching to a non-QMS measure", async () => {
    const mapping: MeasureTargetMapping = [
      {
        ...defaultMeasureMapping[0],
        measureId: "m1",
        includedInQms: true,
      },
      {
        ...defaultMeasureMapping[0],
        measureId: "m2",
        measureName: "Measure 2",
        includedInQms: false,
      },
    ] as MeasureTargetMapping;

    mockGetReportsForState.mockResolvedValue([
      {
        id: "submitted-1",
        name: "Submitted Report",
        status: ReportStatus.SUBMITTED,
      },
    ] as LiteReport[]);

    const { onSubmit } = renderInModal({ measureTargetMapping: mapping });
    await waitForInitialLoad();

    const measureDropdown = screen.getByLabelText("Measure report");
    assert.ok(measureDropdown instanceof HTMLSelectElement);
    await userEvent.selectOptions(measureDropdown, "m1");

    const qmsDropdown = await screen.findByLabelText(
      /submitted Quality Measure Set report/i
    );
    assert.ok(qmsDropdown instanceof HTMLSelectElement);
    await userEvent.selectOptions(qmsDropdown, "submitted-1");

    await userEvent.selectOptions(measureDropdown, "m2");
    await userEvent.click(screen.getByLabelText("Delivery Method: FFS"));
    await userEvent.click(screen.getByLabelText("Numerator"));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ qmsReportId: undefined, measureId: "m2" })
    );
  });

  it("should show an error when QMS reports cannot be rendered", async () => {
    const qmsMeasureMapping: MeasureTargetMapping = [
      {
        ...defaultMeasureMapping[0],
        includedInQms: true,
      },
    ] as MeasureTargetMapping;

    mockGetReportsForState.mockResolvedValueOnce({
      filter: () => undefined,
    });

    renderInModal({ measureTargetMapping: qmsMeasureMapping });
    await waitForInitialLoad();

    const measureDropdown = screen.getByLabelText("Measure report");
    assert.ok(measureDropdown instanceof HTMLSelectElement);
    await userEvent.selectOptions(measureDropdown, "m1");

    expect(
      await screen.findByText(
        "Error loading QMS reports! Please refresh the page."
      )
    ).toBeInTheDocument();
  });

  it("should remove selected delivery method and rate when clicked again", async () => {
    renderInModal({});
    await waitForInitialLoad();

    const measureDropdown = screen.getByLabelText("Measure report");
    assert.ok(measureDropdown instanceof HTMLSelectElement);
    await userEvent.selectOptions(measureDropdown, "m1");

    const deliveryMethod = screen.getByLabelText("Delivery Method: FFS");
    const numeratorRate = screen.getByLabelText("Numerator");

    await userEvent.click(deliveryMethod);
    await userEvent.click(deliveryMethod);
    await userEvent.click(numeratorRate);
    await userEvent.click(numeratorRate);

    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(
      screen.getByText("Please select one or more delivery methods.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Please select one or more rates.")
    ).toBeInTheDocument();
  });
});
