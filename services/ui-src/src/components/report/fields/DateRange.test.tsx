import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { DateRange } from "./DateRange";
import { DateRangeTemplate, ElementType } from "types/report";

const mockedDateRangeElement: DateRangeTemplate = {
  type: ElementType.DateRange,
  id: "measurement-period",
  labels: {
    top: "Measurement period dates",
    start: "Measurement start date",
    end: "Measurement end date",
  },
  helperText:
    "Select the measurement period start and end dates for this individual metric.",
  required: true,
};

const updateSpy = jest.fn();

const DateRangeWrapper = ({ template }: { template: DateRangeTemplate }) => {
  const [element, setElement] = useState(template);

  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };

  return <DateRange element={element} updateElement={onChange} />;
};

describe("<DateRange />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders labels and helper text", () => {
    render(<DateRangeWrapper template={mockedDateRangeElement} />);

    expect(screen.getByText("Measurement period dates")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Select the measurement period start and end dates for this individual metric."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Measurement start date")).toBeInTheDocument();
    expect(screen.getByText("Measurement end date")).toBeInTheDocument();
  });

  test("updates start and end answers", async () => {
    render(<DateRangeWrapper template={mockedDateRangeElement} />);

    const dateFieldInputs = screen.getAllByRole("textbox");
    const startInput = dateFieldInputs[0];
    const endInput = dateFieldInputs[1];

    await userEvent.type(startInput, "01012024");
    await userEvent.type(endInput, "12312024");

    expect(updateSpy).toHaveBeenCalledWith({
      answer: { start: "01/01/2024" },
    });
    expect(updateSpy).toHaveBeenCalledWith({
      answer: { start: "01/01/2024", end: "12/31/2024" },
    });
  });

  test("shows end-before-start validation message", () => {
    render(
      <DateRangeWrapper
        template={{
          ...mockedDateRangeElement,
          answer: {
            start: "12/31/2024",
            end: "01/01/2024",
          },
        }}
      />
    );

    expect(
      screen.getByText("Measurement end date can't be before start date")
    ).toBeInTheDocument();
  });
});
