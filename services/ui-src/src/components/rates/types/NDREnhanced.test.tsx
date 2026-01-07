import { act, render, screen } from "@testing-library/react";
import { NDREnhanced } from "./NDREnhanced";
import userEvent from "@testing-library/user-event";
import { ElementType, NdrEnhancedTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { useState } from "react";

const mockedElement: NdrEnhancedTemplate = {
  id: "mock-perf-id",
  type: ElementType.NdrEnhanced,
  label: "test label",
  helperText: "helper text",
  required: true,
  assessments: [{ id: "test-1", label: "assessment 1" }],
};
const updateSpy = jest.fn();

const NdrEnhancedWrapper = ({
  template,
}: {
  template: NdrEnhancedTemplate;
}) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <NDREnhanced element={element} updateElement={onChange} />;
};

describe("<NDREnhanced />", () => {
  describe("Test NDREnhanced component", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("NDREnhanced is visible", () => {
      render(<NdrEnhancedWrapper template={mockedElement} />);

      expect(
        screen.getByRole("textbox", { name: "test labels Denominator" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Numerator" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Denominator" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Denominator" })
      ).toBeDisabled();
      expect(screen.getByRole("textbox", { name: "Rate" })).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Rate" })).toBeDisabled();
    });

    test("Rate should calculate", async () => {
      render(<NdrEnhancedWrapper template={mockedElement} />);
      const performDenominator = screen.getByRole("textbox", {
        name: "test labels Denominator",
      });
      await act(async () => await userEvent.type(performDenominator, "2"));

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await act(async () => await userEvent.type(numerator, "1"));
      expect(numerator).toHaveValue("1");

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      expect(denominator).toHaveValue("2");

      const rate = screen.getByRole("textbox", { name: "Rate" });
      expect(rate).toHaveValue("0.5");
    });
  });

  testA11y(<NdrEnhancedWrapper template={mockedElement} />);
});
