// AdminDashSelector.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminDashSelector, reportOptions } from "./AdminDashSelector";
import { useNavigate } from "react-router-dom";
import { useFlags } from "launchdarkly-react-client-sdk";
import assert from "node:assert";
import { ReportType } from "types";

type DropdownProps = {
  label: string;
  options: {
    label: string;
    value: string;
  }[];
  onChange: () => void;
  value: string;
};

type ChoiceListProps = {
  label: string;
  choices: {
    label: string;
    value: string;
  }[];
  onChange: () => void;
};

jest.mock("@cmsgov/design-system", () => ({
  Dropdown: ({ label, options, onChange, value }: DropdownProps) => (
    <select aria-label={label} onChange={onChange} value={value}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
  ChoiceList: ({ label, choices, onChange }: ChoiceListProps) => (
    <fieldset>
      <legend>{label}</legend>
      {choices.map((choice) => (
        <div key={choice.value}>
          <input
            type="radio"
            id={choice.value}
            name="report"
            value={choice.value}
            onChange={onChange}
          />
          <label htmlFor={choice.value}>{choice.label}</label>
        </div>
      ))}
    </fieldset>
  ),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("launchdarkly-react-client-sdk", () => ({
  useFlags: jest.fn(),
}));

describe("AdminDashSelector Component", () => {
  const mockNavigate = jest.fn();

  const allFlagsEnabled = {
    isTacmReportActive: true,
    isCiReportActive: true,
    isPcpReportActive: true,
    isQipReportActive: true,
    isWwlReportActive: true,
  };

  test("reportOptions includes every ReportType", () => {
    expect(reportOptions.map((o) => o.value)).toEqual(
      Object.values(ReportType)
    );
  });

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useFlags as jest.Mock).mockReturnValue(allFlagsEnabled);
  });

  test("renders correctly with header and button label", () => {
    render(<AdminDashSelector />);

    expect(
      screen.getByText("View State/Territory Reports")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go to Report Dashboard" })
    ).toBeInTheDocument();
  });

  test("allows user to select a state and report", async () => {
    render(<AdminDashSelector />);

    // Select a state
    const dropdown = screen.getByLabelText("Select state or territory:");
    assert.ok(dropdown instanceof HTMLSelectElement);
    await userEvent.selectOptions(dropdown, "CA");

    // Select a report
    const radioButton = screen.getByLabelText(
      "Quality Measure Set Report (QMS)"
    );
    await userEvent.click(radioButton);
    expect(dropdown.value).toBe("CA");
    expect(radioButton).toBeChecked();
  });

  test("navigates to the correct report URL on form submission", async () => {
    render(<AdminDashSelector />);

    // Select a state and report
    const dropdown = screen.getByLabelText("Select state or territory:");
    await userEvent.selectOptions(dropdown, "CA");
    const radioButton = screen.getByLabelText(
      "Quality Measure Set Report (QMS)"
    );
    await userEvent.click(radioButton);

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: "Go to Report Dashboard",
    });
    await userEvent.click(submitButton);

    // Check if navigate is called with the correct parameters
    expect(mockNavigate).toHaveBeenCalledWith("report/QMS/CA");
  });
  test("submit button is disabled when no state or report is selected", async () => {
    render(<AdminDashSelector />);

    const submitButton = screen.getByRole("button", {
      name: "Go to Report Dashboard",
    });
    expect(submitButton).toBeDisabled();

    // Now select a state
    const dropdown = screen.getByLabelText("Select state or territory:");
    await userEvent.selectOptions(dropdown, "CA");
    // Still disabled without selecting a report
    expect(submitButton).toBeDisabled();

    // Now select a report
    const radioButton = screen.getByLabelText(
      "Quality Measure Set Report (QMS)"
    );
    await userEvent.click(radioButton);
    // Now it should be enabled
    expect(submitButton).toBeEnabled();
  });

  test("hides report options whose feature flag is disabled", () => {
    (useFlags as jest.Mock).mockReturnValue({
      ...allFlagsEnabled,
      isQipReportActive: false,
    });

    render(<AdminDashSelector />);

    expect(
      screen.queryByLabelText("QMS Quality Improvement Plans (QMS QIP)")
    ).not.toBeInTheDocument();
  });

  test("shows report options whose feature flag is enabled", () => {
    render(<AdminDashSelector />);

    expect(
      screen.getByLabelText("QMS Quality Improvement Plans (QMS QIP)")
    ).toBeInTheDocument();
  });
});
