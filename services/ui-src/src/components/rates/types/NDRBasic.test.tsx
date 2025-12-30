import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NDRBasic, NDRBasicExport } from "./NDRBasic";
import { ElementType, NdrBasicTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { useState } from "react";
import { ErrorMessages } from "../../../constants";

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
      await userEvent.type(numerator, "1");
      expect(numerator).toHaveValue("1");

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await userEvent.type(denominator, "2");
      expect(denominator).toHaveValue("2");

      const result = screen.getByRole("textbox", { name: "Result" });
      expect(result).toHaveValue("50");
    });

    test("Rate should not display a decimal point if it is not needed", async () => {
      render(<NdrBasicWrapper template={mockedElement} />);

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await userEvent.type(numerator, "27");

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await userEvent.type(denominator, "3");

      const result = screen.getByRole("textbox", { name: "Result" });
      expect(result).toHaveValue("900");
    });

    test("Rate should not display as a percent normally", async () => {
      render(
        <NdrBasicWrapper
          template={{ ...mockedElement, displayRateAsPercent: false }}
        />
      );

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await userEvent.type(numerator, "1");

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await userEvent.type(denominator, "2");

      expect(screen.getByRole("textbox", { name: "Result" })).toHaveValue("50");
      expect(screen.queryByText("%")).not.toBeInTheDocument();
    });

    test("Rate should display as a percent when appropriate", async () => {
      render(
        <NdrBasicWrapper
          template={{ ...mockedElement, displayRateAsPercent: true }}
        />
      );

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await userEvent.type(numerator, "1");

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await userEvent.type(denominator, "2");

      expect(screen.getByRole("textbox", { name: "Result" })).toHaveValue("50");
      expect(screen.getByText("%")).toBeVisible();
    });

    test("Rate should display trailing decimal places if the value is rounded to 0", async () => {
      render(<NdrBasicWrapper template={mockedElement} />);

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await userEvent.type(numerator, "4");

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await userEvent.type(denominator, "2000");

      const result = screen.getByRole("textbox", { name: "Result" });
      expect(result).toHaveValue("0.2");
    });

    test("Proper error should show if a required field is empty", async () => {
      render(<NdrBasicWrapper template={mockedElement} />);

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await userEvent.type(denominator, "4");
      await userEvent.type(denominator, "{backspace}");

      expect(screen.getByText(ErrorMessages.requiredResponse)).toBeVisible();
    });

    test("Proper error should show if a field has invalid input", async () => {
      render(<NdrBasicWrapper template={mockedElement} />);

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await userEvent.type(denominator, "string");

      expect(screen.getByText(ErrorMessages.mustBeANumber)).toBeVisible();
    });

    test("Error should show if the denominator is 0 and the numerator is not 0, and also clear", async () => {
      render(<NdrBasicWrapper template={mockedElement} />);

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await userEvent.type(numerator, "4");

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await userEvent.type(denominator, "0");

      expect(screen.getByText(ErrorMessages.denominatorZero())).toBeVisible();

      await userEvent.type(denominator, "4");
      expect(
        screen.queryByText(ErrorMessages.denominatorZero())
      ).not.toBeInTheDocument();
    });

    test("Rate should be 0 if both numerator and denominator are 0", async () => {
      render(<NdrBasicWrapper template={mockedElement} />);

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await userEvent.type(numerator, "0");

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await userEvent.type(denominator, "0");

      const result = screen.getByRole("textbox", { name: "Result" });
      expect(result).toHaveValue("0.00");
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
      await userEvent.type(numerator, "9");

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await userEvent.type(denominator, "10");

      const result = screen.getByRole("alert");

      expect(result).toHaveTextContent("Success");
    });

    test("Warning Alert should be visible if minimum rate is met", async () => {
      render(<NdrBasicWrapper template={mockedElement} />);

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await userEvent.type(numerator, "1");

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await userEvent.type(denominator, "10");

      const result = screen.getByRole("alert");

      expect(result).toHaveTextContent("Warning");
    });

    test("Conditional children should be visible if minimum rate is met", async () => {
      render(<NdrBasicWrapper template={mockedElement} />);

      const numerator = screen.getByRole("textbox", { name: "Numerator" });
      await userEvent.type(numerator, "1");

      const denominator = screen.getByRole("textbox", { name: "Denominator" });
      await userEvent.type(denominator, "10");

      expect(screen.getByText("test text area")).toBeVisible();
    });
  });

  describe("NDRBasicExport", () => {
    it("should render a normal rate", () => {
      render(
        NDRBasicExport({
          ...mockedElement,
          displayRateAsPercent: false,
          answer: {
            numerator: 1,
            denominator: 2,
            rate: 50,
          },
        })
      );
      expect(screen.getByRole("row", { name: "Numerator 1" })).toBeVisible();
      expect(screen.getByRole("row", { name: "Denominator 2" })).toBeVisible();
      expect(screen.getByRole("row", { name: "Result 50" })).toBeVisible();
      expect(screen.queryByText("%", { exact: false })).not.toBeInTheDocument();
    });

    it("should render a percentage", () => {
      render(
        NDRBasicExport({
          ...mockedElement,
          displayRateAsPercent: true,
          answer: {
            numerator: 1,
            denominator: 2,
            rate: 50,
          },
        })
      );
      expect(screen.getByRole("row", { name: "Numerator 1" })).toBeVisible();
      expect(screen.getByRole("row", { name: "Denominator 2" })).toBeVisible();
      expect(screen.getByRole("row", { name: "Result 50%" })).toBeVisible();
    });
  });

  testA11y(<NdrBasicWrapper template={mockedElement} />);
});
