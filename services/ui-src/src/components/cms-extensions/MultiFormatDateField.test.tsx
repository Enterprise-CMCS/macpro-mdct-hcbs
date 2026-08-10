import { MultiFormatDateField } from "./MultiFormatDateField";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const onChange = jest.fn();

const fullDateProps = {
  dateFormat: "MMDDYYYY" as const,
  value: "",
  name: "birthday",
  label: "What is your birth date?",
  onChange,
};

const monthYearProps = {
  dateFormat: "MMYYYY" as const,
  name: "birthmonth",
  value: "",
  label: "What is your birth month?",
  onChange,
};

describe("MultiFormatDateField", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("as a full-date input", () => {
    it("should update its hint and callback appropriately", async () => {
      render(<MultiFormatDateField {...fullDateProps} />);
      const input = screen.getByRole("textbox");
      const hint = screen.getAllByText("MM/DD/YYYY")[0];

      // Partial date updates the hint text but doesn't parse
      await userEvent.type(input, "122026");
      expect(hint).toHaveTextContent("12/20/26YY");
      expect(onChange).toHaveBeenLastCalledWith(
        "122026",
        "12/20/26",
        undefined
      );

      // Finished date passes the parse
      await userEvent.type(input, "53");
      expect(hint).toHaveTextContent("12/20/2653");
      expect(onChange).toHaveBeenLastCalledWith(
        "12202653",
        "12/20/2653",
        expect.any(Date)
      );

      // Blurring the input reverts the hint
      await userEvent.tab();
      expect(hint).toHaveTextContent("MM/DD/YYYY");
    });

    it("should pad single-digit month and year", async () => {
      render(<MultiFormatDateField {...fullDateProps} />);
      const input = screen.getByRole("textbox");
      const hint = screen.getAllByText("MM/DD/YYYY")[0];

      // Non-numeric characters treated as delimiters
      await userEvent.type(input, "5-5.2026");
      expect(hint).toHaveTextContent("05/05/2026");
      expect(onChange).toHaveBeenLastCalledWith(
        "5-5.2026",
        "05/05/2026",
        expect.any(Date)
      );
    });
  });

  describe("as a month and year input", () => {
    it("should update its hint and callback appropriately", async () => {
      render(<MultiFormatDateField {...monthYearProps} />);
      const input = screen.getByRole("textbox");
      const hint = screen.getAllByText("MM/YYYY")[0];

      // Partial date updates the hint text but doesn't parse
      await userEvent.type(input, "12202");
      expect(hint).toHaveTextContent("12/202Y");
      expect(onChange).toHaveBeenLastCalledWith("12202", "12/202", undefined);

      // Finished date passes the parse
      await userEvent.type(input, "6");
      expect(hint).toHaveTextContent("12/2026");
      expect(onChange).toHaveBeenLastCalledWith(
        "122026",
        "12/2026",
        expect.any(Date)
      );

      // Blurring the input reverts the hint
      await userEvent.tab();
      expect(hint).toHaveTextContent("MM/YYYY");
    });

    it("should pad single-digit month and year", async () => {
      render(<MultiFormatDateField {...monthYearProps} />);
      const input = screen.getByRole("textbox");
      const hint = screen.getAllByText("MM/YYYY")[0];

      // Non-numeric characters treated as delimiters
      await userEvent.type(input, "5x2026");
      expect(hint).toHaveTextContent("05/2026");
      expect(onChange).toHaveBeenLastCalledWith(
        "5x2026",
        "05/2026",
        expect.any(Date)
      );
    });
  });
});
