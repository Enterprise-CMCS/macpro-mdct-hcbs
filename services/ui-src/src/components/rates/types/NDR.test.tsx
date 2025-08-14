import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NDR } from "./NDR";
import { ElementType, NdrTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { useState } from "react";

const mockedPerformanceElement: NdrTemplate = {
  id: "mock-perf-id",
  type: ElementType.Ndr,
  label: "test label",
  performanceTargetLabel:
    "What is the 2028 state performance target for this assessment?",
};
const updateSpy = jest.fn();

const NdrWrapper = ({ template }: { template: NdrTemplate }) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <NDR element={element} updateElement={onChange} />;
};

describe("<NDR />", () => {
  describe("Test NDR component", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("NDR is visible", () => {
      render(<NdrWrapper template={mockedPerformanceElement} />);

      expect(
        screen.getByRole("textbox", {
          name: "What is the 2028 state performance target for this assessment?",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Numerator" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Denominator" })
      ).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Rate" })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Rate" })).toBeDisabled();
    });

    test("Rate should calculate", async () => {
      render(<NdrWrapper template={mockedPerformanceElement} />);

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await act(async () => await userEvent.type(numerator, "1"));
      expect(numerator).toHaveValue("1");

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await act(async () => await userEvent.type(denominator, "2"));
      expect(denominator).toHaveValue("2");

      const rate = screen.getByRole("textbox", { name: "Rate" });
      expect(rate).toHaveValue("0.5");
    });

    test("Rate should not display a decimal point if it is not needed", async () => {
      render(<NdrWrapper template={mockedPerformanceElement} />);

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await act(async () => await userEvent.type(numerator, "27"));

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await act(async () => await userEvent.type(denominator, "3"));

      const rate = screen.getByRole("textbox", { name: "Rate" });
      expect(rate).toHaveValue("9");
    });

    test("Rate should display trailing decimal places if the value is rounded to 0", async () => {
      render(<NdrWrapper template={mockedPerformanceElement} />);

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await act(async () => await userEvent.type(numerator, "4"));

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await act(async () => await userEvent.type(denominator, "2000"));

      const rate = screen.getByRole("textbox", { name: "Rate" });
      expect(rate).toHaveValue("0.00");
    });
  });

  testA11y(<NdrWrapper template={mockedPerformanceElement} />);
});
