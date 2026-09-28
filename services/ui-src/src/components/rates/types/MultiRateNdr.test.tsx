import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { MultiRateNdr } from "./MultiRateNdr";
import userEvent from "@testing-library/user-event";
import { ElementType, MultiRateNdrTemplate } from "types";
import { testA11y } from "utils/testing/commonTests";
import { useState } from "react";
import { ErrorMessages } from "../../../constants";

const mockedElement: MultiRateNdrTemplate = {
  id: "mock-perf-id",
  type: ElementType.MultiRateNdr,
  label: "test label",
  hint: "test hint",
  helperText: "helper text",
  required: true,
  assessments: [
    {
      id: "test-1",
      label: "assessment 1",
      hints: {
        hintNumerator: "hint numerator",
        hintDenominator: "hint denominator",
        hintRate: "hint rate",
      },
    },
  ],
};
const updateSpy = vi.fn();

const MultRateNdrWrapper = ({
  template,
}: {
  template: MultiRateNdrTemplate;
}) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <MultiRateNdr element={element} updateElement={onChange} />;
};

describe("<MultiRateNdr />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", () => {
    render(<MultRateNdrWrapper template={mockedElement} />);

    expect(
      screen.getByRole("textbox", { name: "test labels Denominator" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("test hint", { selector: "p" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Numerator" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("hint numerator", { selector: "p" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Denominator" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Denominator" })).toBeDisabled();
    expect(
      screen.getByText("hint denominator", { selector: "p" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Rate" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Rate" })).toBeDisabled();
    expect(
      screen.getByText("hint rate", { selector: "p" })
    ).toBeInTheDocument();
  });

  it("should auto-calculate rate", async () => {
    render(<MultRateNdrWrapper template={mockedElement} />);
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

  it("should show an error if the denominator is 0", async () => {
    render(<MultRateNdrWrapper template={mockedElement} />);
    const performDenominator = screen.getByRole("textbox", {
      name: "test labels Denominator",
    });
    await act(async () => await userEvent.type(performDenominator, "0"));

    expect(screen.getByText(ErrorMessages.denominatorZero())).toBeVisible();

    await act(async () => await userEvent.type(performDenominator, "4"));
    expect(
      screen.queryByText(ErrorMessages.denominatorZero())
    ).not.toBeInTheDocument();
  });

  it("should set rate to 0 if both numerator and denominator are 0", async () => {
    render(<MultRateNdrWrapper template={mockedElement} />);
    const performDenominator = screen.getByRole("textbox", {
      name: "test labels Denominator",
    });
    await act(async () => await userEvent.type(performDenominator, "0"));

    const numerator = screen.getByRole("textbox", { name: "Numerator" });
    await act(async () => await userEvent.type(numerator, "0"));
    expect(numerator).toHaveValue("0");
    const denominator = screen.getByRole("textbox", { name: "Denominator" });
    expect(denominator).toHaveValue("0");

    const rate = screen.getByRole("textbox", { name: "Rate" });
    expect(rate).toHaveValue("0.00");
  });

  testA11y(<MultRateNdrWrapper template={mockedElement} />);
});
