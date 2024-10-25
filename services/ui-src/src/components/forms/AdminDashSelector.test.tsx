// AdminDashSelector.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminDashSelector } from "./AdminDashSelector";
import { useNavigate } from "react-router-dom";

jest.mock("Components", () => ({
  Dropdown: ({ label, options, onChange, value }: any) => (
    <select aria-label={label} onChange={onChange} value={value}>
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
  ChoiceList: ({ label, choices, onChange }: any) => (
    <fieldset>
      <legend>{label}</legend>
      {choices.map((choice: any) => (
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

describe("AdminDashSelector Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  const mockVerbiage = {
    header: "Select a State and Report",
    buttonLabel: "Submit",
  };

  test("renders correctly with header and button label", () => {
    render(<AdminDashSelector verbiage={mockVerbiage} />);

    expect(screen.getByText(mockVerbiage.header)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: mockVerbiage.buttonLabel })
    ).toBeInTheDocument();
  });

  test("allows user to select a state and report", async () => {
    render(<AdminDashSelector verbiage={mockVerbiage} />);

    // Select a state
    const dropdown = screen.getByLabelText(
      "Select state or territory:"
    ) as HTMLSelectElement;
    await userEvent.selectOptions(dropdown, "CA");

    // Select a report
    const radioButton = screen.getByLabelText(
      "Quality Measures (QM)"
    ) as HTMLElement;
    await userEvent.click(radioButton);
    expect(dropdown.value).toBe("CA");
    expect(radioButton).toBeChecked();
  });

  test("navigates to the correct report URL on form submission", async () => {
    render(<AdminDashSelector verbiage={mockVerbiage} />);

    // Select a state and report
    const dropdown = screen.getByLabelText("Select state or territory:");
    await userEvent.selectOptions(dropdown, "CA");
    const radioButton = screen.getByLabelText("Quality Measures (QM)");
    await userEvent.click(radioButton);

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: mockVerbiage.buttonLabel,
    });
    await userEvent.click(submitButton);

    // Check if navigate is called with the correct parameters
    expect(mockNavigate).toHaveBeenCalledWith("report/QM/CA");
  });
  test("submit button is disabled when no state or report is selected", async () => {
    render(<AdminDashSelector verbiage={mockVerbiage} />);

    const submitButton = screen.getByRole("button", {
      name: mockVerbiage.buttonLabel,
    });
    expect(submitButton).toBeDisabled();

    // Now select a state
    const dropdown = screen.getByLabelText("Select state or territory:");
    await userEvent.selectOptions(dropdown, "CA");
    // Still disabled without selecting a report
    expect(submitButton).toBeDisabled();

    // Now select a report
    const radioButton = screen.getByLabelText("Quality Measures (QM)");
    await userEvent.click(radioButton);
    // Now it should be enabled
    expect(submitButton).toBeEnabled();
  });
});
