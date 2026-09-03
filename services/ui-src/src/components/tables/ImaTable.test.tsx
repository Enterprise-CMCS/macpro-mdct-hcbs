import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImaTable } from "components";
import { ImaTableColumn, ImaTableRow } from "types";
import { testA11y } from "utils/testing/commonTests";

const columns: ImaTableColumn[] = [
  { id: "ima-description", label: "Incident Type" },
  { id: "ima-radio-yes", label: "Yes" },
  { id: "ima-radio-no", label: "No" },
  { id: "ima-delete", label: "Delete" },
];

const rows: ImaTableRow[] = [
  { id: "verbal-abuse", description: "Verbal Abuse" },
  { id: "neglect", description: "Neglect", answer: "yes" },
  { id: "exploitation", description: "Exploitation", answer: "no" },
];

const onAnswerChange = vi.fn();
const onDescriptionChange = vi.fn();
const onAddRow = vi.fn();
const onDeleteRow = vi.fn();

const defaultProps = {
  caption: "Critical Incident Definition Table",
  columns,
  rows,
  addButtonText: "Add Other Incident Type",
  customRowLabel: "Other incident type:",
  errorMessage: "Not compliant.",
  allowCustomRows: true,
  onAnswerChange,
  onDescriptionChange,
  onAddRow,
  onDeleteRow,
};

const imaTableComponent = <ImaTable {...defaultProps} />;

describe("<ImaTable />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render a header cell for each column", () => {
    render(imaTableComponent);

    expect(screen.getByRole("table")).toBeVisible();
    for (const column of columns) {
      expect(
        screen.getByRole("columnheader", { name: column.label })
      ).toBeVisible();
    }
  });

  it("should not render the add button or delete column when custom rows are not allowed", () => {
    render(
      <ImaTable
        {...defaultProps}
        allowCustomRows={false}
        rows={[
          ...rows,
          { id: "other", description: "Other type", custom: true },
        ]}
      />
    );

    expect(
      screen.queryByRole("button", { name: /Add Other Incident Type/ })
    ).toBeNull();
    expect(screen.queryByRole("columnheader", { name: "Delete" })).toBeNull();
    expect(
      screen.queryByRole("button", { name: "Delete Other type" })
    ).toBeNull();
  });

  it("should keep header and body cell counts aligned when custom rows are not allowed", () => {
    render(<ImaTable {...defaultProps} allowCustomRows={false} />);

    expect(screen.getAllByRole("columnheader")).toHaveLength(
      columns.length - 1
    );
    const bodyRow = screen.getAllByRole("row")[1];
    expect(within(bodyRow).getAllByRole("cell")).toHaveLength(
      columns.length - 1
    );
  });

  it("should render the label and helper text above the table", () => {
    render(
      <ImaTable
        {...defaultProps}
        label="mock label"
        helperText="mock helper text"
      />
    );

    expect(screen.getByText("mock label")).toBeVisible();
    expect(screen.getByText("mock helper text")).toBeVisible();
    expect(screen.getByRole("group", { name: /mock label/ })).toContainElement(
      screen.getByRole("table")
    );
  });

  it("should omit the label and helper text when not provided", () => {
    render(imaTableComponent);

    expect(document.querySelector("legend")).toBeNull();
    expect(document.querySelector(".ds-c-hint")).toBeNull();
  });

  it("should render a row for each entry with its description", () => {
    render(imaTableComponent);

    // one header row plus one row per entry
    expect(screen.getAllByRole("row")).toHaveLength(rows.length + 1);
    for (const row of rows) {
      expect(screen.getByText(row.description)).toBeVisible();
    }
  });

  it("should check the radio matching the saved answer", () => {
    render(imaTableComponent);

    expect(
      screen.getByRole("radio", { name: "Yes for Neglect" })
    ).toBeChecked();
    expect(
      screen.getByRole("radio", { name: "No for Neglect" })
    ).not.toBeChecked();
    expect(
      screen.getByRole("radio", { name: "No for Exploitation" })
    ).toBeChecked();
  });

  it("should leave both radios unchecked when there is no answer", () => {
    render(imaTableComponent);

    expect(
      screen.getByRole("radio", { name: "Yes for Verbal Abuse" })
    ).not.toBeChecked();
    expect(
      screen.getByRole("radio", { name: "No for Verbal Abuse" })
    ).not.toBeChecked();
  });

  it("should call onAnswerChange with yes when the Yes radio is selected", async () => {
    render(imaTableComponent);

    await userEvent.click(
      screen.getByRole("radio", { name: "Yes for Verbal Abuse" })
    );

    expect(onAnswerChange).toHaveBeenCalledWith("verbal-abuse", "yes");
  });

  it("should call onAnswerChange with no when the No radio is selected", async () => {
    render(imaTableComponent);

    await userEvent.click(
      screen.getByRole("radio", { name: "No for Verbal Abuse" })
    );

    expect(onAnswerChange).toHaveBeenCalledWith("verbal-abuse", "no");
  });

  it("should show an error message only on rows answered no", () => {
    render(imaTableComponent);

    const alerts = screen.getAllByRole("alert");
    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toHaveTextContent("Not compliant.");
  });

  it("should render a custom error message when provided", () => {
    render(<ImaTable {...defaultProps} errorMessage="Custom error" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Custom error");
  });

  it("should call onAddRow when the add button is clicked", async () => {
    render(imaTableComponent);

    await userEvent.click(
      screen.getByRole("button", { name: /Add Other Incident Type/ })
    );

    expect(onAddRow).toHaveBeenCalledTimes(1);
  });

  it("should render an editable description for custom rows only", () => {
    render(
      <ImaTable
        {...defaultProps}
        rows={[
          ...rows,
          { id: "other", description: "Other type", custom: true },
        ]}
      />
    );

    const inputs = screen.getAllByRole("textbox", {
      name: "Other incident type:",
    });
    expect(inputs).toHaveLength(1);
    expect(inputs[0]).toHaveValue("Other type");
    expect(screen.getByText("Other incident type:")).toBeVisible();
  });

  it("should render a custom row label when provided", () => {
    render(
      <ImaTable
        {...defaultProps}
        customRowLabel="Other type:"
        rows={[{ id: "other", description: "", custom: true }]}
      />
    );

    expect(screen.getByRole("textbox", { name: "Other type:" })).toBeVisible();
  });

  it("should call onDescriptionChange when a custom description is edited", async () => {
    render(
      <ImaTable
        {...defaultProps}
        rows={[{ id: "other", description: "", custom: true }]}
      />
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "Other incident type:" }),
      "A"
    );

    expect(onDescriptionChange).toHaveBeenCalledWith("other", "A");
  });

  it("should label the controls of a custom row without a description", () => {
    render(
      <ImaTable
        {...defaultProps}
        rows={[{ id: "other", description: "", custom: true }]}
      />
    );

    expect(
      screen.getByRole("radio", { name: "Yes for new incident type" })
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Delete new incident type" })
    ).toBeVisible();
  });

  it("should call onDeleteRow with the row id when delete is clicked", async () => {
    render(
      <ImaTable
        {...defaultProps}
        rows={[
          ...rows,
          { id: "other", description: "Other type", custom: true },
        ]}
      />
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Delete Other type" })
    );

    expect(onDeleteRow).toHaveBeenCalledWith("other");
  });

  it("should only render a delete button on rows added by the button", () => {
    render(
      <ImaTable
        {...defaultProps}
        rows={[
          ...rows,
          { id: "other", description: "Other type", custom: true },
        ]}
      />
    );

    expect(
      screen.getByRole("button", { name: "Delete Other type" })
    ).toBeVisible();
    for (const row of rows) {
      expect(
        screen.queryByRole("button", { name: `Delete ${row.description}` })
      ).toBeNull();
    }
  });

  it("should disable all inputs when disabled", async () => {
    render(
      <ImaTable
        {...defaultProps}
        rows={[{ id: "other", description: "Other type", custom: true }]}
        disabled
      />
    );

    expect(
      screen.getByRole("radio", { name: "Yes for Other type" })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Delete Other type" })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Add Other Incident Type/ })
    ).toBeDisabled();

    await userEvent.click(
      screen.getByRole("button", { name: "Delete Other type" })
    );
    expect(onDeleteRow).not.toHaveBeenCalled();
  });

  testA11y(imaTableComponent);
});
