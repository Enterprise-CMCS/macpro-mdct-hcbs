import { DateField } from "components/fields/DateField";
import { testA11y } from "utils/testing/commonTests";
import { DateTemplate, ElementType } from "types/report";
import { render, screen } from "@testing-library/react";
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
const updateSpy = jest.fn();

const DateFieldWrapper = ({ template }: { template: DateTemplate }) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <DateField element={element} updateElement={onChange} />;
};

describe("<DateField />", () => {
  describe("Test DateField basic functionality", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("DateField is visible", () => {
      render(<DateFieldWrapper template={mockedDateTextboxElement} />);
      const dateFieldInput = screen.getByRole("textbox");
      expect(dateFieldInput).toBeVisible();
    });

    test("Datefield validates its input", async () => {
      render(<DateFieldWrapper template={mockedDateTextboxElement} />);
      const dateFieldInput = screen.getByRole("textbox");

      await userEvent.type(dateFieldInput, "invalid date");

      expect(screen.getByText(/Response must be a date/)).toBeInTheDocument();
      expect(updateSpy).not.toHaveBeenCalledWith({
        answer: expect.any(String),
      });
    });

    test("Datefield sends updates to its callback", async () => {
      render(<DateFieldWrapper template={mockedDateTextboxElement} />);
      const dateFieldInput = screen.getByRole("textbox");

      await userEvent.type(dateFieldInput, "10162024");
      expect(updateSpy).toHaveBeenCalledWith({ answer: "10/16/2024" });
    });

    test("Datefield supports MM/YYYY when dateFormat is MMYYYY", async () => {
      render(<DateFieldWrapper template={mockedMonthYearTextboxElement} />);
      const dateFieldInput = screen.getByRole("textbox");

      await userEvent.type(dateFieldInput, "102024");
      expect(updateSpy).toHaveBeenCalledWith({ answer: "10/2024" });
    });

    test("Datefield validates MM/YYYY when dateFormat is MMYYYY", async () => {
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
  });

  testA11y(<DateFieldWrapper template={mockedDateTextboxElement} />);
});
