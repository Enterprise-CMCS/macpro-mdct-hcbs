import { DateField } from "components/fields/DateField";
import { testA11y } from "utils/testing/commonTests";
import { DateTemplate, ElementType, PageElement } from "types/report";
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
const updateSpy = jest.fn();

const DateFieldWrapper = ({
  template,
  allElements,
}: {
  template: DateTemplate;
  allElements?: PageElement[];
}) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return (
    <DateField
      element={element}
      updateElement={onChange}
      allElements={allElements}
    />
  );
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

    test("shows measurement end-before-start error message", () => {
      const startDate: DateTemplate = {
        type: ElementType.Date,
        id: "measurement-period-start-date",
        label: "Measurement start date",
        required: true,
        answer: "12/31/2024",
      };
      const endDate: DateTemplate = {
        type: ElementType.Date,
        id: "measurement-period-end-date",
        label: "Measurement end date",
        required: true,
        answer: "01/01/2024",
      };

      render(
        <DateFieldWrapper
          template={endDate}
          allElements={[startDate, endDate]}
        />
      );

      expect(
        screen.getByText("Measurement end date can't be before start date")
      ).toBeInTheDocument();
    });

    test("does not show range error for non-measurement end date fields", () => {
      const startDate: DateTemplate = {
        type: ElementType.Date,
        id: "measurement-period-start-date",
        label: "Measurement start date",
        required: true,
        answer: "12/31/2024",
      };
      const otherDate: DateTemplate = {
        type: ElementType.Date,
        id: "some-other-date",
        label: "Some other date",
        required: true,
        answer: "01/01/2024",
      };

      render(
        <DateFieldWrapper
          template={otherDate}
          allElements={[startDate, otherDate]}
        />
      );

      expect(
        screen.queryByText("Measurement end date can't be before start date")
      ).not.toBeInTheDocument();
    });

    test("does not show range error when end date is after start date", () => {
      const startDate: DateTemplate = {
        type: ElementType.Date,
        id: "measurement-period-start-date",
        label: "Measurement start date",
        required: true,
        answer: "01/01/2024",
      };
      const endDate: DateTemplate = {
        type: ElementType.Date,
        id: "measurement-period-end-date",
        label: "Measurement end date",
        required: true,
        answer: "12/31/2024",
      };

      render(
        <DateFieldWrapper
          template={endDate}
          allElements={[startDate, endDate]}
        />
      );

      expect(
        screen.queryByText("Measurement end date can't be before start date")
      ).not.toBeInTheDocument();
    });

    test("uses field-specific invalid date message when provided", async () => {
      const template: DateTemplate = {
        ...mockedDateTextboxElement,
        id: "measurement-period-end-date",
        invalidDateMessage:
          "Measurement end date is invalid. Please enter date in MM/DD/YYYY format",
      };

      render(<DateFieldWrapper template={template} />);
      const dateFieldInput = screen.getByRole("textbox");

      await userEvent.type(dateFieldInput, "invalid date");

      expect(
        screen.getByText(
          "Measurement end date is invalid. Please enter date in MM/DD/YYYY format"
        )
      ).toBeInTheDocument();
    });
  });

  testA11y(<DateFieldWrapper template={mockedDateTextboxElement} />);
});
