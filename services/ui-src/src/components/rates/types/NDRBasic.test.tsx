import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NDRBasic } from "./NDRBasic";
import { ElementType, NdrBasicTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { useState } from "react";

const mockedElement: NdrBasicTemplate = {
  id: "mock-perf-id",
  type: ElementType.NdrBasic,
  label: "test label",
  multiplier: 100,
  minPerformanceLevel: 90,
  required: true,
  conditionalChildren: [
    {
      type: ElementType.TextAreaField,
      id: "mock-text-id",
      label: "test text area",
      helperText: "helper text",
      required: true,
    },
  ],
};
const updateSpy = jest.fn();

const NdrBasicWrapper = ({ template }: { template: NdrBasicTemplate }) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <NDRBasic element={element} updateElement={onChange} />;
};

describe("<NDRBasic />", () => {
  describe("Test NDRBasic component", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("NDRBasic is visible", () => {
      render(<NdrBasicWrapper template={mockedElement} />);
      expect(
        screen.getByRole("textbox", { name: "Numerator" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Denominator" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: "Result" })
      ).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: "Result" })).toBeDisabled();
    });

    test("Rate should calculate", async () => {
      render(<NdrBasicWrapper template={mockedElement} />);

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await act(async () => await userEvent.type(numerator, "1"));
      expect(numerator).toHaveValue("1");

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await act(async () => await userEvent.type(denominator, "2"));
      expect(denominator).toHaveValue("2");

      const result = screen.getByRole("textbox", { name: "Result" });
      expect(result).toHaveValue("50");
    });

    test("Rate should not display a decimal point if it is not needed", async () => {
      render(<NdrBasicWrapper template={mockedElement} />);

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await act(async () => await userEvent.type(numerator, "27"));

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await act(async () => await userEvent.type(denominator, "3"));

      const result = screen.getByRole("textbox", { name: "Result" });
      expect(result).toHaveValue("900");
    });

    test("Rate should display trailing decimal places if the value is rounded to 0", async () => {
      render(<NdrBasicWrapper template={mockedElement} />);

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await act(async () => await userEvent.type(numerator, "4"));

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await act(async () => await userEvent.type(denominator, "2000"));

      const result = screen.getByRole("textbox", { name: "Result" });
      expect(result).toHaveValue("0.2");
    });
  });

  describe("Miniminum Performance Rate Alerts", () => {
    test("Alert should be not visible if rate is empty", async () => {
      render(<NdrBasicWrapper template={mockedElement} />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    test("Success Alert should be visible if minimum rate is met", async () => {
      render(<NdrBasicWrapper template={mockedElement} />);

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await act(async () => await userEvent.type(numerator, "9"));

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await act(async () => await userEvent.type(denominator, "10"));

      const result = screen.getByRole("alert");

      expect(result).toHaveTextContent("Success");
    });

    test("Warning Alert should be visible if minimum rate is met", async () => {
      render(<NdrBasicWrapper template={mockedElement} />);

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await act(async () => await userEvent.type(numerator, "1"));

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await act(async () => await userEvent.type(denominator, "10"));

      const result = screen.getByRole("alert");

      expect(result).toHaveTextContent("Warning");
    });

    test("Conditional children should be visible if minimum rate is met", async () => {
      render(<NdrBasicWrapper template={mockedElement} />);

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await act(async () => await userEvent.type(numerator, "1"));

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await act(async () => await userEvent.type(denominator, "10"));

      expect(screen.getByText("test text area")).toBeVisible();
    });
  });

  testA11y(<NdrBasicWrapper template={mockedElement} />);
});
