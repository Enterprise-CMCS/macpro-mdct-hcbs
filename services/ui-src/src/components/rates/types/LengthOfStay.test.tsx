import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { LengthOfStay } from "./LengthOfStay";
import userEvent from "@testing-library/user-event";
import {
  ElementType,
  LengthOfStayField,
  LengthOfStayRateTemplate,
} from "types";
import { testA11y } from "utils/testing/commonTests";
import { useState } from "react";
import { ErrorMessages } from "../../../constants";

const mockedPerformanceElement: LengthOfStayRateTemplate = {
  id: "mock-perf-id",
  type: ElementType.LengthOfStayRate,
  required: true,
  labels: {
    actualCount: "Count of Successful Discharges to the Community",
    denominator: "Facility Admission Count",
    expectedCount: "Expected Count of Successful Discharges to the Community",
    populationRate: "Multi-Plan Population Rate",
    actualRate:
      "Observed Performance Rate for Minimizing Length of Facility Stay",
    expectedRate:
      "Expected Performance Rate for Minimizing Length of Facility Stay",
    adjustedRate: "Risk Adjusted Rate for Minimizing Length of Facility Stay",
  },
  hintText: {
    actualCountHint: "Actual count hint text",
    denominatorHint: "Denominator hint text",
    expectedCountHint: "Expected count hint text",
    populationRateHint: "Population rate hint text",
    actualRateHint: "Actual rate hint text",
    expectedRateHint: "Expected rate hint text",
    adjustedRateHint: "Adjusted rate hint text",
  },
};
const updateSpy = vi.fn();

const LengthOfStayWrapper = ({
  template,
}: {
  template: LengthOfStayRateTemplate;
}) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <LengthOfStay element={element} updateElement={onChange} />;
};

describe("<LengthOfStay />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const labels = mockedPerformanceElement.labels;
  const getInput = (fieldId: LengthOfStayField) => {
    return screen.getByRole("textbox", { name: labels[fieldId] });
  };

  const getInputWithOptionalField = (fieldId: LengthOfStayField) => {
    return screen.getByText((content) => content.startsWith(labels[fieldId]));
  };

  const enterValue = async (fieldId: LengthOfStayField, value: string) => {
    await act(() => userEvent.type(getInput(fieldId), value));
  };

  it("should render its fields, enabled or disabled appropriately", async () => {
    render(<LengthOfStayWrapper template={mockedPerformanceElement} />);
    for (let fieldId of Object.keys(labels)) {
      if (fieldId === "populationRate")
        expect(
          getInputWithOptionalField(fieldId as LengthOfStayField)
        ).toBeInTheDocument();
      else expect(getInput(fieldId as LengthOfStayField)).toBeInTheDocument();
    }

    for (let editableFieldId of [
      "actualCount",
      "denominator",
      "expectedCount",
      "adjustedRate",
    ] as const) {
      expect(getInput(editableFieldId)).not.toBeDisabled();
    }

    expect(
      getInputWithOptionalField("populationRate" as LengthOfStayField)
    ).not.toBeDisabled();

    for (let autoCalcFieldId of ["actualRate", "expectedRate"] as const) {
      expect(getInput(autoCalcFieldId)).toBeDisabled();
    }
  });

  it("should auto-calculate rates", async () => {
    render(<LengthOfStayWrapper template={mockedPerformanceElement} />);

    await enterValue("actualCount", "1");
    await enterValue("denominator", "2");
    await enterValue("expectedCount", "1");
    await enterValue("adjustedRate", "2");

    expect(getInput("actualRate")).toHaveValue("0.5");
    expect(getInput("expectedRate")).toHaveValue("0.5");
  });

  it("should show an if the denominator is 0, and should also clear", async () => {
    render(<LengthOfStayWrapper template={mockedPerformanceElement} />);

    await enterValue("denominator", "0");

    expect(
      screen.getByText(
        ErrorMessages.denominatorZero(
          mockedPerformanceElement.labels.actualCount,
          mockedPerformanceElement.labels.denominator
        )
      )
    ).toBeVisible();

    await enterValue("denominator", "4");
    expect(
      screen.queryByText(
        ErrorMessages.denominatorZero(
          mockedPerformanceElement.labels.actualCount,
          mockedPerformanceElement.labels.denominator
        )
      )
    ).not.toBeInTheDocument();
  });

  it("should set rate to 0 if both numerator and denominator are 0", async () => {
    render(<LengthOfStayWrapper template={mockedPerformanceElement} />);

    await enterValue("actualCount", "0");
    await enterValue("denominator", "0");
    await enterValue("expectedCount", "0");

    expect(getInput("actualRate")).toHaveValue("0.00");
    expect(getInput("expectedRate")).toHaveValue("0.00");
  });

  it("should display hint texts for all fields", () => {
    render(<LengthOfStayWrapper template={mockedPerformanceElement} />);

    expect(screen.getByText("Actual count hint text")).toBeVisible();
    expect(screen.getByText("Denominator hint text")).toBeVisible();
    expect(screen.getByText("Expected count hint text")).toBeVisible();
    expect(screen.getByText("Population rate hint text")).toBeVisible();
    expect(screen.getByText("Actual rate hint text")).toBeVisible();
    expect(screen.getByText("Expected rate hint text")).toBeVisible();
    expect(screen.getByText("Adjusted rate hint text")).toBeVisible();
  });

  testA11y(<LengthOfStayWrapper template={mockedPerformanceElement} />);
});
