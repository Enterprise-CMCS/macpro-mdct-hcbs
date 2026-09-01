import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { DateRange } from "./DateRange";
import { DateRangeTemplate, ElementType } from "types/report";

const updateSpy = vi.fn();

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
    vi.clearAllMocks();
  });

  describe("With standard month-day-year format", () => {
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
      answer: {
        start: "",
      },
    };
    it("should render labels and helper text", () => {
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

    it("should update start and end answers", async () => {
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

    it("should show end-before-start validation message", () => {
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

  describe("with month-year format", () => {
    const mockedMMYYYYRangeElement: DateRangeTemplate = {
      type: ElementType.DateRange,
      id: "strategy-timeframe",
      dateFormat: "MMYYYY",
      labels: {
        top: "Strategy timeframe",
        start: "Start month",
        end: "Projected end month",
      },
      helperText: "Enter projected strategy timeframe.",
      startHelperText: "Enter a projected start month.",
      endHelperText: "Leave blank if the strategy is ongoing.",
      required: true,
      endDateRequired: false,
      answer: {
        start: "",
      },
    };

    it("should render MM/YYYY labels", () => {
      render(<DateRangeWrapper template={mockedMMYYYYRangeElement} />);
      expect(screen.getByText("Strategy timeframe")).toBeInTheDocument();
      expect(screen.getByText("Start month")).toBeInTheDocument();
      expect(screen.getByText("Projected end month")).toBeInTheDocument();
    });

    it("should render per-field helper text", () => {
      render(<DateRangeWrapper template={mockedMMYYYYRangeElement} />);
      expect(
        screen.getByText("Enter a projected start month.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Leave blank if the strategy is ongoing.")
      ).toBeInTheDocument();
    });

    it("should display (optional) suffix on end date label when endDateRequired is false", () => {
      render(<DateRangeWrapper template={mockedMMYYYYRangeElement} />);
      expect(screen.getByText("(optional)")).toBeInTheDocument();
    });

    it("should update start and end MM/YYYY answers", async () => {
      render(<DateRangeWrapper template={mockedMMYYYYRangeElement} />);
      const [startInput, endInput] = screen.getAllByRole("textbox");

      await userEvent.type(startInput, "012024");
      await userEvent.type(endInput, "122024");

      expect(updateSpy).toHaveBeenCalledWith({ answer: { start: "01/2024" } });
      expect(updateSpy).toHaveBeenCalledWith({
        answer: { start: "01/2024", end: "12/2024" },
      });
    });

    it("should show end-before-start error for MM/YYYY range", () => {
      render(
        <DateRangeWrapper
          template={{
            ...mockedMMYYYYRangeElement,
            answer: { start: "12/2024", end: "01/2024" },
          }}
        />
      );
      expect(
        screen.getByText("End date can't be before start date")
      ).toBeInTheDocument();
    });

    it("should accept MM/YYYY end date equal to start date", async () => {
      render(
        <DateRangeWrapper
          template={{
            ...mockedMMYYYYRangeElement,
            answer: { start: "10/2024" },
          }}
        />
      );
      const [, endInput] = screen.getAllByRole("textbox");
      await userEvent.type(endInput, "102024");

      expect(
        screen.queryByText("End date can't be before start date")
      ).not.toBeInTheDocument();
      expect(updateSpy).toHaveBeenCalledWith({
        answer: { start: "10/2024", end: "10/2024" },
      });
    });

    it("should accept a valid MM/YYYY range with no end date when endDateRequired is false", async () => {
      render(<DateRangeWrapper template={mockedMMYYYYRangeElement} />);
      const [startInput] = screen.getAllByRole("textbox");
      await userEvent.type(startInput, "012024");

      expect(updateSpy).toHaveBeenCalledWith({ answer: { start: "01/2024" } });
      expect(
        screen.queryByText("End date can't be before start date")
      ).not.toBeInTheDocument();
    });
  });
});
