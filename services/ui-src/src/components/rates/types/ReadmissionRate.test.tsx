import { act, render, screen } from "@testing-library/react";
import { ReadmissionRate } from "./ReadmissionRate";
import userEvent from "@testing-library/user-event";
import {
  ElementType,
  ReadmissionRateField,
  ReadmissionRateTemplate,
} from "types";
import { testA11y } from "utils/testing/commonTests";
import { useState } from "react";
import { ErrorMessages } from "../../../constants";

const mockedPerformanceElement: ReadmissionRateTemplate = {
  id: "mock-perf-id",
  type: ElementType.ReadmissionRate,
  required: true,
  labels: {
    denominatorCol1: "Count of Index Hospital Stays",
    numeratorCol2: "Count of Observed 30-Day Readmissions",
    expectedRateCol3: "Observed Readmission Rate",
    numeratorDenominatorCol4: "Count of Expected 30-Day readmissions",
    expectedRateCol5: "Expected Readmission Rate",
    expectedRateCol6: "Observed-to-Expected Ratio",
    denominatorCol7: "Count of Beneficiaries in Medicaid Population",
    numeratorCol8: "Number of Outliers",
    expectedRateCol9: "Outlier Rate",
  },
};
const updateSpy = jest.fn();

const ReadmissionRateWrapper = ({
  template,
}: {
  template: ReadmissionRateTemplate;
}) => {
  const [element, setElement] = useState(template);
  const onChange = (updatedElement: Partial<typeof element>) => {
    updateSpy(updatedElement);
    setElement({ ...element, ...updatedElement });
  };
  return <ReadmissionRate element={element} updateElement={onChange} />;
};

describe("<ReadmissionRate />", () => {
  describe("Test ReadmissionRate component", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const labels = mockedPerformanceElement.labels;
    const getInput = (fieldId: ReadmissionRateField) => {
      return screen.getByRole("textbox", { name: labels[fieldId] });
    };

    const enterValue = async (fieldId: ReadmissionRateField, value: string) => {
      await act(() => userEvent.type(getInput(fieldId), value));
    };

    test("Fields are visible, and disabled appropriately", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);

      // All fields should be visible
      for (let fieldId of Object.keys(labels)) {
        expect(getInput(fieldId as ReadmissionRateField)).toBeInTheDocument();
      }

      // User input fields should not be disabled
      for (let editableFieldId of [
        "denominatorCol1",
        "numeratorCol2",
        "numeratorDenominatorCol4",
        "denominatorCol7",
        "numeratorCol8",
      ] as const) {
        expect(getInput(editableFieldId)).not.toBeDisabled();
      }

      // Calculated fields should be disabled
      for (let autoCalcFieldId of [
        "expectedRateCol3",
        "expectedRateCol5",
        "expectedRateCol6",
        "expectedRateCol9",
      ] as const) {
        expect(getInput(autoCalcFieldId)).toBeDisabled();
      }
    });

    test("Fields should auto-calculate with correct multipliers", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);
      await enterValue("denominatorCol1", "100");
      await enterValue("numeratorCol2", "25");
      await enterValue("numeratorDenominatorCol4", "20");
      await enterValue("denominatorCol7", "1000");
      await enterValue("numeratorCol8", "5");

      // Col 3: (25/100) * 100 = 25%
      expect(getInput("expectedRateCol3")).toHaveValue("25");
      // Col 5: (20/100) * 100 = 20.00%
      expect(getInput("expectedRateCol5")).toHaveValue("20");
      // Col 6: 25/20 = 1.25 (ratio, no multiplier)
      expect(getInput("expectedRateCol6")).toHaveValue("1.25");
      // Col 9: (5/1000) * 1000 = 5.00 per 1000
      expect(getInput("expectedRateCol9")).toHaveValue("5");
    });

    test("Error should show if denominatorCol1 is 0 and numeratorCol2 is not 0", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);

      await enterValue("denominatorCol1", "0");
      await enterValue("numeratorCol2", "1");

      expect(
        screen.getByText(
          ErrorMessages.denominatorZero(
            mockedPerformanceElement.labels.numeratorCol2,
            mockedPerformanceElement.labels.denominatorCol1
          )
        )
      ).toBeVisible();
    });

    test("Error should show if denominatorCol1 is 0 and numeratorDenominatorCol4 is not 0", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);

      await enterValue("denominatorCol1", "0");
      await enterValue("numeratorDenominatorCol4", "1");

      expect(
        screen.getByText(
          ErrorMessages.denominatorZero(
            mockedPerformanceElement.labels.numeratorDenominatorCol4,
            mockedPerformanceElement.labels.denominatorCol1
          )
        )
      ).toBeVisible();
    });

    test("Error should show if numeratorDenominatorCol4 is 0 and numeratorCol2 is not 0", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);

      await enterValue("numeratorDenominatorCol4", "0");
      await enterValue("numeratorCol2", "1");

      expect(
        screen.getByText(
          ErrorMessages.denominatorZero(
            mockedPerformanceElement.labels.numeratorCol2,
            mockedPerformanceElement.labels.numeratorDenominatorCol4
          )
        )
      ).toBeVisible();
    });

    test("Error should show if denominatorCol7 is 0 and numeratorCol8 is not 0", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);

      await enterValue("denominatorCol7", "0");
      await enterValue("numeratorCol8", "1");

      expect(
        screen.getByText(
          ErrorMessages.denominatorZero(
            mockedPerformanceElement.labels.numeratorCol8,
            mockedPerformanceElement.labels.denominatorCol7
          )
        )
      ).toBeVisible();
    });

    test("Error should clear when denominator becomes non-zero", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);

      await enterValue("denominatorCol1", "0");
      await enterValue("numeratorCol2", "1");

      await act(() => userEvent.clear(getInput("denominatorCol1")));
      await enterValue("denominatorCol1", "4");

      expect(
        screen.queryByText(
          ErrorMessages.denominatorZero(
            mockedPerformanceElement.labels.numeratorCol2,
            mockedPerformanceElement.labels.denominatorCol1
          )
        )
      ).not.toBeInTheDocument();
    });

    test("Rate should be 0 if both numerator and denominator are 0", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);

      await enterValue("denominatorCol1", "0");
      await enterValue("numeratorCol2", "0");
      await enterValue("numeratorDenominatorCol4", "0");
      await enterValue("denominatorCol7", "0");
      await enterValue("numeratorCol8", "0");

      expect(getInput("expectedRateCol3")).toHaveValue("0.00");
      expect(getInput("expectedRateCol5")).toHaveValue("0.00");
      expect(getInput("expectedRateCol6")).toHaveValue("0.00");
      expect(getInput("expectedRateCol9")).toHaveValue("0.00");
    });

    test("Calculated fields should be empty when denominators are non-zero but numerators are missing", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);

      await enterValue("denominatorCol1", "100");
      await enterValue("denominatorCol7", "1000");

      expect(getInput("expectedRateCol3")).toHaveValue("");
      expect(getInput("expectedRateCol5")).toHaveValue("");
      expect(getInput("expectedRateCol6")).toHaveValue("");
      expect(getInput("expectedRateCol9")).toHaveValue("");
    });
  });

  testA11y(<ReadmissionRateWrapper template={mockedPerformanceElement} />);
});
