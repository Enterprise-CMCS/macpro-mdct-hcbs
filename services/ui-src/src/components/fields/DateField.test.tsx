import { beforeEach, describe, expect, it, vi } from "vitest";
import { DateField } from "components/fields/DateField";
import { testA11y } from "utils/testing/commonTests";
import { DateTemplate, ElementType } from "types/report";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

const mockedDateTextboxElement: DateTemplate = {
  id: "mock-date-id",
  type: ElementType.Date,
  label: "test-date-field",
  helperText: "helper text",
  required: true,
};

const mockedMonthYearTextboxElement: DateTemplate = {
  id: "mock-month-year-id",
  type: ElementType.Date,
  label: "test-month-year-field",
  helperText: "helper text",
  dateFormat: "MMYYYY",
  required: true,
};

const updateSpy = vi.fn();

const DateFieldWrapper = ({ template }: { template: DateTemplate }) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <DateField element={element} updateElement={onChange} />;
};

describe("<DateField />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render a textbox", () => {
    render(<DateFieldWrapper template={mockedDateTextboxElement} />);
    const dateFieldInput = screen.getByRole("textbox");
    expect(dateFieldInput).toBeVisible();
  });

  it("should validate its input", async () => {
    render(<DateFieldWrapper template={mockedDateTextboxElement} />);
    const dateFieldInput = screen.getByRole("textbox");

    await userEvent.type(dateFieldInput, "invalid date");

    expect(screen.getByText(/Response must be a date/)).toBeInTheDocument();
    expect(updateSpy).not.toHaveBeenCalledWith({
      answer: expect.any(String),
    });
  });

  it("should send updates to its callback", async () => {
    render(<DateFieldWrapper template={mockedDateTextboxElement} />);
    const dateFieldInput = screen.getByRole("textbox");

    await userEvent.type(dateFieldInput, "10162024");
    expect(updateSpy).toHaveBeenCalledWith({ answer: "10/16/2024" });
  });

  it("should support MM/YYYY when dateFormat is MMYYYY", async () => {
    render(<DateFieldWrapper template={mockedMonthYearTextboxElement} />);
    const dateFieldInput = screen.getByRole("textbox");

    await userEvent.type(dateFieldInput, "102024");
    expect(updateSpy).toHaveBeenCalledWith({ answer: "10/2024" });
  });

  it("should normalize slash input for MM/YYYY", async () => {
    render(<DateFieldWrapper template={mockedMonthYearTextboxElement} />);
    const dateFieldInput = screen.getByRole("textbox");

    await userEvent.type(dateFieldInput, "1/2024");
    expect(updateSpy).toHaveBeenCalledWith({ answer: "01/2024" });
  });

  it("should normalize delimited M-YYYY input to 0M/YYYY", () => {
    render(<DateFieldWrapper template={mockedMonthYearTextboxElement} />);
    const dateFieldInput = screen.getByRole("textbox");

    fireEvent.change(dateFieldInput, { target: { value: "1.2024" } });
    expect(updateSpy).toHaveBeenCalledWith({ answer: "01/2024" });
  });

  it("should validate MM/YYYY when dateFormat is MMYYYY", async () => {
    render(<DateFieldWrapper template={mockedMonthYearTextboxElement} />);
    const dateFieldInput = screen.getByRole("textbox");

    await userEvent.type(dateFieldInput, "132024");

    expect(
      screen.getByText(/Response must be a date in MMYYYY format/)
    ).toBeInTheDocument();
    expect(updateSpy).not.toHaveBeenCalledWith({
      answer: expect.any(String),
    });
  });

  testA11y(<DateFieldWrapper template={mockedDateTextboxElement} />);
});
