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

const mockedEndDateElement: DateTemplate = {
  id: "end-date",
  type: ElementType.Date,
  label: "Projected end date",
  helperText: "helper text",
  dateFormat: "MMYYYY",
  required: false,
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

    test("Datefield normalizes slash input for MM/YYYY", async () => {
      render(<DateFieldWrapper template={mockedMonthYearTextboxElement} />);
      const dateFieldInput = screen.getByRole("textbox");

      await userEvent.type(dateFieldInput, "1/2024");
      expect(updateSpy).toHaveBeenCalledWith({ answer: "01/2024" });
    });

    test("Datefield normalizes 5-digit MYYYY input for MM/YYYY", () => {
      render(<DateFieldWrapper template={mockedMonthYearTextboxElement} />);
      const dateFieldInput = screen.getByRole("textbox");

      fireEvent.change(dateFieldInput, { target: { value: "12024" } });
      expect(updateSpy).toHaveBeenCalledWith({ answer: "01/2024" });
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

    test("end date shows error when it is not after start date", async () => {
      render(
        <>
          <input name="start-date" defaultValue="10/2024" />
          <DateFieldWrapper template={mockedEndDateElement} />
        </>
      );
      await userEvent.type(screen.getAllByRole("textbox")[1], "092024");
      expect(
        screen.getByText("End date can't be before start date")
      ).toBeInTheDocument();
    });

    test("end date accepts a date after start date", async () => {
      render(
        <>
          <input name="start-date" defaultValue="10/2024" />
          <DateFieldWrapper template={mockedEndDateElement} />
        </>
      );
      await userEvent.type(screen.getAllByRole("textbox")[1], "112024");
      expect(updateSpy).toHaveBeenCalledWith({ answer: "11/2024" });
    });

    test("end date accepts the same month/year as start date", async () => {
      render(
        <>
          <input name="start-date" defaultValue="10/2024" />
          <DateFieldWrapper template={mockedEndDateElement} />
        </>
      );
      await userEvent.type(screen.getAllByRole("textbox")[1], "102024");

      expect(
        screen.queryByText("End date can't be before start date")
      ).not.toBeInTheDocument();
      expect(updateSpy).toHaveBeenCalledWith({ answer: "10/2024" });
    });

    test("end date does not show cross-date error when start date is missing", async () => {
      render(<DateFieldWrapper template={mockedEndDateElement} />);
      await userEvent.type(screen.getByRole("textbox"), "092024");

      expect(
        screen.queryByText("End date can't be before start date")
      ).not.toBeInTheDocument();
      expect(updateSpy).toHaveBeenCalledWith({ answer: "09/2024" });
    });

    test("non end-date MM/YYYY field does not run cross-date validation", async () => {
      render(
        <>
          <input name="start-date" defaultValue="12/2025" />
          <DateFieldWrapper template={mockedMonthYearTextboxElement} />
        </>
      );
      await userEvent.type(screen.getAllByRole("textbox")[1], "012025");

      expect(
        screen.queryByText("End date can't be before start date")
      ).not.toBeInTheDocument();
      expect(updateSpy).toHaveBeenCalledWith({ answer: "01/2025" });
    });
  });

  testA11y(<DateFieldWrapper template={mockedDateTextboxElement} />);
});
