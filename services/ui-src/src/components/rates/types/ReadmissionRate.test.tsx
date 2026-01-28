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
    stayCount: "Count of Index Hospital Stays",
    obsReadmissionCount: "Count of Observed 30-Day Readmissions",
    obsReadmissionRate: "Observed Readmission Rate",
    expReadmissionCount: "Count of Expected 30-Day readmissions",
    expReadmissionRate: "Expected Readmission Rate",
    obsExpRatio: "Observed-to-Expected Ratio",
    beneficiaryCount: "Count of Beneficiaries in Medicaid Population",
    outlierCount: "Number of Outliers",
    outlierRate: "Outlier Rate",
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
        "stayCount",
        "obsReadmissionCount",
        "expReadmissionCount",
        "beneficiaryCount",
        "outlierCount",
      ] as const) {
        expect(getInput(editableFieldId)).not.toBeDisabled();
      }

      // Calculated fields should be disabled
      for (let autoCalcFieldId of [
        "obsReadmissionRate",
        "expReadmissionRate",
        "obsExpRatio",
        "outlierRate",
      ] as const) {
        expect(getInput(autoCalcFieldId)).toBeDisabled();
      }
    });

    test("Fields should auto-calculate with correct multipliers", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);
      await enterValue("stayCount", "100");
      await enterValue("obsReadmissionCount", "25");
      await enterValue("expReadmissionCount", "20");
      await enterValue("beneficiaryCount", "1000");
      await enterValue("outlierCount", "5");

      // Col 3: (25/100) * 100 = 25%
      expect(getInput("obsReadmissionRate")).toHaveValue("25");
      // Col 5: (20/100) * 100 = 20.00%
      expect(getInput("expReadmissionRate")).toHaveValue("20");
      // Col 6: 25/20 = 1.25 (ratio, no multiplier)
      expect(getInput("obsExpRatio")).toHaveValue("1.25");
      // Col 9: (5/1000) * 1000 = 5.00 per 1000
      expect(getInput("outlierRate")).toHaveValue("5");
    });

    test("Error should show if stayCount is 0 and obsReadmissionCount is not 0", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);

      await enterValue("stayCount", "0");
      await enterValue("obsReadmissionCount", "1");

      expect(
        screen.getByText(
          ErrorMessages.denominatorZero(
            mockedPerformanceElement.labels.obsReadmissionCount,
            mockedPerformanceElement.labels.stayCount
          )
        )
      ).toBeVisible();
    });

    test("Error should show if stayCount is 0 and expReadmissionCount is not 0", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);

      await enterValue("stayCount", "0");
      await enterValue("expReadmissionCount", "1");

      expect(
        screen.getByText(
          ErrorMessages.denominatorZero(
            mockedPerformanceElement.labels.expReadmissionCount,
            mockedPerformanceElement.labels.stayCount
          )
        )
      ).toBeVisible();
    });

    test("Error should show if expReadmissionCount is 0 and obsReadmissionCount is not 0", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);

      await enterValue("expReadmissionCount", "0");
      await enterValue("obsReadmissionCount", "1");

      expect(
        screen.getByText(
          ErrorMessages.denominatorZero(
            mockedPerformanceElement.labels.obsReadmissionCount,
            mockedPerformanceElement.labels.expReadmissionCount
          )
        )
      ).toBeVisible();
    });

    test("Error should show if beneficiaryCount is 0 and outlierCount is not 0", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);

      await enterValue("beneficiaryCount", "0");
      await enterValue("outlierCount", "1");

      expect(
        screen.getByText(
          ErrorMessages.denominatorZero(
            mockedPerformanceElement.labels.outlierCount,
            mockedPerformanceElement.labels.beneficiaryCount
          )
        )
      ).toBeVisible();
    });

    test("Error should clear when denominator becomes non-zero", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);

      await enterValue("stayCount", "0");
      await enterValue("obsReadmissionCount", "1");

      await act(() => userEvent.clear(getInput("stayCount")));
      await enterValue("stayCount", "4");

      expect(
        screen.queryByText(
          ErrorMessages.denominatorZero(
            mockedPerformanceElement.labels.obsReadmissionCount,
            mockedPerformanceElement.labels.stayCount
          )
        )
      ).not.toBeInTheDocument();
    });

    test("Rate should be 0 if both numerator and denominator are 0", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);

      await enterValue("stayCount", "0");
      await enterValue("obsReadmissionCount", "0");
      await enterValue("expReadmissionCount", "0");
      await enterValue("beneficiaryCount", "0");
      await enterValue("outlierCount", "0");

      expect(getInput("obsReadmissionRate")).toHaveValue("0.00");
      expect(getInput("expReadmissionRate")).toHaveValue("0.00");
      expect(getInput("obsExpRatio")).toHaveValue("0.00");
      expect(getInput("outlierRate")).toHaveValue("0.00");
    });

    test("Calculated fields should be empty when denominators are non-zero but numerators are missing", async () => {
      render(<ReadmissionRateWrapper template={mockedPerformanceElement} />);

      await enterValue("stayCount", "100");
      await enterValue("beneficiaryCount", "1000");

      expect(getInput("obsReadmissionRate")).toHaveValue("");
      expect(getInput("expReadmissionRate")).toHaveValue("");
      expect(getInput("obsExpRatio")).toHaveValue("");
      expect(getInput("outlierRate")).toHaveValue("");
    });
  });

  testA11y(<ReadmissionRateWrapper template={mockedPerformanceElement} />);
});
