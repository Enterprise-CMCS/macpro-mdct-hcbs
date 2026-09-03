import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
const onDeleteRow = vi.fn();

const imaTableComponent = (
  <ImaTable
    caption="Critical Incident Definition Table"
    columns={columns}
    rows={rows}
    onAnswerChange={onAnswerChange}
    onDeleteRow={onDeleteRow}
  />
);

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

  it("should render the label and helper text above the table", () => {
    render(
      <ImaTable
        caption="Critical Incident Definition Table"
        columns={columns}
        rows={rows}
        label="mock label"
        helperText="mock helper text"
        onAnswerChange={onAnswerChange}
        onDeleteRow={onDeleteRow}
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
    render(
      <ImaTable
        caption="Critical Incident Definition Table"
        columns={columns}
        rows={rows}
        errorMessage="Custom error"
        onAnswerChange={onAnswerChange}
        onDeleteRow={onDeleteRow}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Custom error");
  });

  it("should call onDeleteRow with the row id when delete is clicked", async () => {
    render(imaTableComponent);

    await userEvent.click(
      screen.getByRole("button", { name: "Delete Verbal Abuse" })
    );

    expect(onDeleteRow).toHaveBeenCalledWith("verbal-abuse");
  });

  it("should disable all inputs when disabled", async () => {
    render(
      <ImaTable
        caption="Critical Incident Definition Table"
        columns={columns}
        rows={rows}
        disabled
        onAnswerChange={onAnswerChange}
        onDeleteRow={onDeleteRow}
      />
    );

    expect(
      screen.getByRole("radio", { name: "Yes for Verbal Abuse" })
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Delete Verbal Abuse" })
    ).toBeDisabled();

    await userEvent.click(
      screen.getByRole("button", { name: "Delete Verbal Abuse" })
    );
    expect(onDeleteRow).not.toHaveBeenCalled();
  });

  testA11y(imaTableComponent);
});
